import { OverwriteMode } from '@octopusdeploy/api-client'
import { getInputParameters } from '../../src/input-parameters'

test('get input parameters', () => {
  const inputParameters = getInputParameters(false)
  expect(inputParameters).toBeDefined()
  expect(inputParameters.packages).toBeDefined()
  expect(inputParameters.packages).toHaveLength(1)
  expect(inputParameters.packages).toContain('test.nupkg')
  expect(inputParameters.overwriteMode).toBe(OverwriteMode.FailIfExists)
})

test('get input parameters on retry', () => {
  const inputParameters = getInputParameters(true)
  expect(inputParameters).toBeDefined()
  expect(inputParameters.packages).toBeDefined()
  expect(inputParameters.packages).toHaveLength(1)
  expect(inputParameters.packages).toContain('test.nupkg')
  expect(inputParameters.overwriteMode).toBe(OverwriteMode.IgnoreIfExists)
})
