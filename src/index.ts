import {setFailed} from '@actions/core'
import * as octopus from './push-package'
import * as inputs from './input-parameters'

async function run(): Promise<void> {
  try {
    const inputParameters = inputs.get()
    await octopus.pushPackage(inputParameters)
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

run()
