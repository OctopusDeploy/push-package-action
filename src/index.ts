import { getInputParameters } from './input-parameters'
import { info, warning, setFailed } from '@actions/core'
import { CliInputs, createBuildSummary, pushPackage } from './octopus-cli-wrapper'
import { CliOutput } from './cli-util'

// GitHub actions entrypoint
async function run(): Promise<void> {
  try {
    const inputs: CliInputs = { parameters: getInputParameters(), env: process.env }
    const outputs: CliOutput = { info: s => info(s), warn: s => warning(s) }

    const { success, pushedPackages } = await pushPackage(inputs, outputs, 'octo')
    if (success) {
      await createBuildSummary(pushedPackages)
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

run()
