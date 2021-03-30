import * as core from '@actions/core'
import * as octopus from './push-package'
import * as inputs from '../src/input-parameters'

async function run(): Promise<void> {
  try {
    const inputParameters = inputs.get()
    await octopus.pushPackage(inputParameters)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
