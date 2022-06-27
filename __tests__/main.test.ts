import * as inputs from '../src/input-parameters'
import * as octopus from '../src/push-package'

describe('inputs', () => {
  it('successfully get input parameters', async () => {
    const inputParameters = inputs.get()
    expect(inputParameters != undefined)
  }, 100000)
})

describe('releases', () => {
  it('successfully pushes a package', async () => {
    const inputParameters = inputs.get()
    await octopus.pushPackage(inputParameters)
  }, 100000)
})
