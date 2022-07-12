import * as tmp from 'tmp'

tmp.setGracefulCleanup()
const tmpdir = tmp.dirSync({ template: 'push-package-XXXXXX' })
process.env = Object.assign(process.env, {
  INPUT_API_KEY: process.env['OCTOPUS_TEST_APIKEY'],
  INPUT_DEBUG: false,
  INPUT_SERVER: process.env['OCTOPUS_TEST_URL'],
  INPUT_PACKAGES: 'test.nupkg',
  INPUT_OVERWRITE_MODE: 'OverwriteExisting',
  INPUT_USE_DELTA_COMPRESSION: true,
  RUNNER_TEMP: tmpdir.name,
  RUNNER_TOOL_CACHE: tmpdir.name,
  GITHUB_ACTION: '1'
})
