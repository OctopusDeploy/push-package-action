import { makeInputParameters } from '../../src/input-parameters'
import { generateLaunchConfig } from '../../src/octopus-cli-wrapper'

test('no parameters', async () => {
  const launchInfo = await generateLaunchConfig({ parameters: makeInputParameters(), env: {} }, console)
  expect(launchInfo.args).toEqual(['push'])
})

test('all the parameters', async () => {
  const i = makeInputParameters({
    packages: ['test.1.2.3.zip'],
    apiKey: 'API-FOOBAR',
    debug: true,
    logLevel: 'verbose',
    overwriteMode: 'OverwriteExisting',
    proxy: 'some-proxy',
    proxyPassword: 'some-proxy-pass',
    proxyUsername: 'some-proxy-user',
    server: 'https://octopus.server',
    space: 'Spaces-1',
    timeout: '1200',
    useDeltaCompression: false
  })

  const launchInfo = await generateLaunchConfig({ parameters: i, env: {} }, console)
  expect(launchInfo.env).toEqual({
    OCTOPUS_CLI_API_KEY: 'API-FOOBAR',
    OCTOPUS_CLI_SERVER: 'https://octopus.server'
  })

  expect(launchInfo.args).toEqual([
    'push',
    '--space=Spaces-1',
    '--proxy=some-proxy',
    '--proxyUser=some-proxy-user',
    '--proxyPass=some-proxy-pass',
    '--debug',
    '--overwrite-mode=OverwriteExisting',
    '--package=test.1.2.3.zip',
    '--logLevel=verbose',
    '--timeout=1200',
    '--use-delta-compression=false'
  ])
})

test('all the parameters where env has the values', async () => {
  const i = makeInputParameters({
    packages: ['test.1.2.3.zip'],
    debug: true,
    logLevel: 'verbose',
    overwriteMode: 'OverwriteExisting',
    timeout: '1200',
    useDeltaCompression: false
  })

  const env = {
    OCTOPUS_API_KEY: 'API FOOBAR',
    OCTOPUS_HOST: 'http://octopusServer',
    OCTOPUS_SPACE: 'Spaces-1',
    OCTOPUS_PROXY: 'some-proxy',
    OCTOPUS_PROXY_USERNAME: 'some-proxy-user',
    OCTOPUS_PROXY_PASSWORD: 'some-proxy-pass'
  }

  const launchInfo = await generateLaunchConfig({ parameters: i, env }, console)
  expect(launchInfo.env).toEqual({
    OCTOPUS_CLI_API_KEY: 'API FOOBAR',
    OCTOPUS_CLI_SERVER: 'http://octopusServer'
  })

  expect(launchInfo.args).toEqual([
    'push',
    '--space=Spaces-1',
    '--proxy=some-proxy',
    '--proxyUser=some-proxy-user',
    '--proxyPass=some-proxy-pass',
    '--debug',
    '--overwrite-mode=OverwriteExisting',
    '--package=test.1.2.3.zip',
    '--logLevel=verbose',
    '--timeout=1200',
    '--use-delta-compression=false'
  ])
})

test('fails if the overwriteMode is invalid', async () => {
  const i = makeInputParameters({
    packages: ['test.1.2.3.zip'],
    apiKey: 'API-FOOBAR',
    overwriteMode: 'Banana',
    server: 'https://octopus.server',
    space: 'Spaces-1'
  })
  await expect(generateLaunchConfig({ parameters: i, env: {} }, console)).rejects.toThrowError(
    'The input value, overwrite_mode is invalid; accept values are "FailIfExists", "OverwriteExisting", and "IgnoreIfExists".'
  )
})

test('globbing packages for matched ending with .zip', async () => {
  const i = makeInputParameters({
    packages: ['__tests__/testpkgs/**/*.zip'],
    apiKey: 'API-FOOBAR',
    server: 'https://octopus.server'
  })
  const env = {
    OCTOPUS_API_KEY: 'API FOOBAR',
    OCTOPUS_HOST: 'http://octopusServer',
    OCTOPUS_SPACE: 'Spaces-1'
  }

  const launchInfo = await generateLaunchConfig({ parameters: i, env }, console)

  expect(launchInfo.args).toEqual([
    'push',
    '--space=Spaces-1',
    '--package=__tests__/testpkgs/linux/apple.2.2.2.zip',
    '--package=__tests__/testpkgs/linux/test.1.0.0.zip',
    '--package=__tests__/testpkgs/linux/test.1.1.1.zip',
    '--package=__tests__/testpkgs/main.1.1.1.zip',
    '--package=__tests__/testpkgs/win/test.1.0.0.zip',
    '--package=__tests__/testpkgs/win/test.1.0.1.zip'
  ])
})
