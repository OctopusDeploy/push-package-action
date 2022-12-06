import { setGracefulCleanup, dirSync } from 'tmp'

setGracefulCleanup()
const tmpdir = dirSync({ template: 'push-package-XXXXXX' })
process.env = Object.assign(process.env, {
  INPUT_SERVER: process.env['OCTOPUS_TEST_URL'],
  INPUT_API_KEY: process.env['OCTOPUS_TEST_API_KEY'],
  INPUT_SPACE: 'Default',
  INPUT_PACKAGES: 'test.nupkg',
  RUNNER_TEMP: tmpdir.name,
  RUNNER_TOOL_CACHE: tmpdir.name,
  GITHUB_ACTION: '1'
})
