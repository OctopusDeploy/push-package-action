import { debug, info, warning, error, setFailed, isDebug } from '@actions/core'
import { getInputParameters } from './input-parameters'
import { createBuildSummary, pushPackageFromInputs } from './push-packages'
import { Client, ClientConfiguration, Logger } from '@octopusdeploy/api-client'
import process from 'process'

// GitHub actions entrypoint
;(async (): Promise<void> => {
  try {
    const logger: Logger = {
      debug: message => {
        if (isDebug()) {
          debug(message)
        }
      },
      info: message => info(message),
      warn: message => warning(message),
      error: (message, err) => {
        if (err !== undefined) {
          error(err.message)
        } else {
          error(message)
        }
      }
    }

    const parameters = getInputParameters(parseInt(process.env['GITHUB_RUN_ATTEMPT'] || '0') > 1)

    const config: ClientConfiguration = {
      userAgentApp: 'GitHubActions push-package-action',
      instanceURL: parameters.server,
      apiKey: parameters.apiKey,
      logging: logger
    }

    const client: Client = await Client.create(config)
    if (client === undefined) throw new Error('Client could not be constructed')

    const pushedPackages = await pushPackageFromInputs(client, parameters)
    await createBuildSummary(pushedPackages)
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
})()
