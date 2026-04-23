import { jest } from '@jest/globals'
import { Client, ClientConfiguration, Logger, OverwriteMode, PackageRepository } from '@octopusdeploy/api-client'
import { randomBytes } from 'crypto'
import { promises as fs } from 'fs'
import * as os from 'os'
import * as path from 'path'
import { CaptureOutput } from '../test-helpers'
import { InputParameters } from '../../src/input-parameters'
import { pushPackageFromInputs } from '../../src/push-packages'

// NOTE: These tests assume Octopus is running and connectable.
// In the build pipeline they run as part of test.yml, which starts an Octopus
// Docker container and sets OCTOPUS_TEST_URL and OCTOPUS_TEST_API_KEY.
//
// To run locally, start Octopus yourself and set those environment variables.

const apiClientConfig: ClientConfiguration = {
  userAgentApp: 'Test',
  apiKey: process.env.OCTOPUS_TEST_API_KEY || 'API-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  instanceURL: process.env.OCTOPUS_TEST_URL || 'http://localhost:8050'
}

describe('integration tests', () => {
  jest.setTimeout(100000)

  const runId = randomBytes(16).toString('hex')

  const spaceName = process.env.OCTOPUS_TEST_SPACE || 'Default'

  const packageId = `TestPackage${runId}`
  const packageVersion = '1.0.0'
  const packageFilename = `${packageId}.${packageVersion}.zip`

  let tempDir: string
  let packagePath: string

  beforeAll(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'push-package-test'))
    packagePath = path.join(tempDir, packageFilename)

    // Minimal valid empty zip (End of Central Directory record only)
    const emptyZip = Buffer.from('504b050600000000000000000000000000000000000000', 'hex')
    await fs.writeFile(packagePath, emptyZip)
  })

  afterAll(async () => {
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true })
    }
  })

  test('can push package', async () => {
    const output = new CaptureOutput()

    const logger: Logger = {
      debug: message => output.debug(message),
      info: message => output.info(message),
      warn: message => output.warn(message),
      error: (message, err) => {
        if (err !== undefined) {
          output.error(err.message)
        } else {
          output.error(message)
        }
      }
    }

    const config: ClientConfiguration = {
      userAgentApp: 'Test',
      instanceURL: apiClientConfig.instanceURL,
      apiKey: apiClientConfig.apiKey,
      logging: logger
    }

    const client = await Client.create(config)

    const parameters: InputParameters = {
      server: apiClientConfig.instanceURL,
      apiKey: apiClientConfig.apiKey,
      space: spaceName,
      packages: [packagePath],
      overwriteMode: OverwriteMode.FailIfExists
    }

    const result = await pushPackageFromInputs(client, parameters)

    expect(result).toHaveLength(1)
    expect(result[0]).toBe(packagePath)

    // Verify the package appears in Octopus
    const packageRepository = new PackageRepository(client, spaceName)
    const packages = await packageRepository.list({ nuGetPackageId: packageId })
    expect(packages.Items.some(p => p.PackageId === packageId && p.Version === packageVersion)).toBe(true)
  })
})
