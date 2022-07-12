import { getInputParameters } from '../../src/input-parameters'

test('get input parameters', () => {
  const inputParameters = getInputParameters()
  expect(inputParameters).toBeDefined()
  expect(inputParameters.packages).toBeDefined()
  expect(inputParameters.packages).toHaveLength(1)
  expect(inputParameters.packages).toContain('test.nupkg')
})