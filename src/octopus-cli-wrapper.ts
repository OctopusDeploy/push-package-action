import { InputParameters } from './input-parameters'
import { info, setFailed, summary } from '@actions/core'
import { exec, ExecOptions } from '@actions/exec'
import path from 'path'

// environment variables can either be a NodeJS.ProcessEnv or a plain old object with string keys/values for testing
type EnvVars = { [key: string]: string } | NodeJS.ProcessEnv

export class OctopusCliWrapper {
  inputParameters: InputParameters
  env: EnvVars
  logInfo: (message: string) => void
  logWarn: (message: string) => void
  pushedPackages: string[] = [];

  constructor(
    parameters: InputParameters,
    env: EnvVars,
    logInfo: (message: string) => void,
    logWarn: (message: string) => void
  ) {
    this.inputParameters = parameters
    this.env = env
    this.logInfo = logInfo
    this.logWarn = logWarn
  }

  async stdline(line: string): Promise<void> {
    if (line.length <= 0) return

    if (line.includes('Octopus Deploy Command Line Tool')) {
      const version = line.split('version ')[1]
      this.logInfo(`🐙 Using Octopus Deploy CLI ${version}...`)
      return
    }

    if (line.includes('Handshaking with Octopus Server')) {
      this.logInfo(`🤝 Handshaking with Octopus Deploy`)
      return
    }

    if (line.includes('Authenticated as:')) {
      this.logInfo(`✅ Authenticated`)
      return
    }

    if (line.includes('Pushing package:')) {
      const pkg  = line.replace('Pushing package: ', '').replace('...', '')
      this.pushedPackages.push(pkg)

      this.logInfo(`📦 Pushing ${pkg}`)
      return
    }

    switch (line) {
      case 'Push successful':
        this.logInfo(`🎉 Push successful!`)
        await this.createBuildSummary()
        break
      default:
        this.logInfo(line)
        break
    }
  }

  // Picks up a config value from GHA Input or environment, supports mapping
  // of an obsolete env var to a newer one (e.g. OCTOPUS_CLI_SERVER vs OCTOPUS_HOST)
  pickupConfigurationValueExtended(
    inputParameter: string,
    inputObsoleteEnvKey: string,
    inputNewEnvKey: string,
    valueHandler: (value: string) => void
  ): void {
    // we always want to log the warning for a deprecated environment variable, even if the parameter comes in via inputParameter
    let result: string | undefined

    const deprecatedValue = this.env[inputObsoleteEnvKey]
    if (deprecatedValue && deprecatedValue.length > 0) {
      this.logWarn(`Detected Deprecated ${inputObsoleteEnvKey} environment variable. Prefer ${inputNewEnvKey}`)
      result = deprecatedValue
    }
    const value = this.env[inputNewEnvKey]
    // deliberately not 'else if' because if both OCTOPUS_CLI_API_KEY and OCTOPUS_API_KEY are set we want the latter to win
    if (value && value.length > 0) {
      result = value
    }
    if (inputParameter.length > 0) {
      result = inputParameter
    }
    if (result) {
      valueHandler(result)
    }
  }

  // Picks up a config value from GHA Input or environment
  pickupConfigurationValue(
    inputParameter: string,
    inputNewEnvKey: string,
    valueHandler: (value: string) => void
  ): void {
    if (inputParameter.length > 0) {
      valueHandler(inputParameter)
    } else {
      const value = this.env[inputNewEnvKey]
      if (value && value.length > 0) {
        valueHandler(value)
      }
    }
  }

  // Converts incoming environment and inputParameters into a set of commandline args + env vars to run the Octopus CLI
  generateLaunchConfig(): CliLaunchConfiguration {
    const launchArgs: string[] = ['push']
    const launchEnv: { [key: string]: string } = {}

    const parameters = this.inputParameters

    this.pickupConfigurationValueExtended(
      parameters.apiKey,
      'OCTOPUS_CLI_API_KEY',
      'OCTOPUS_API_KEY',
      value => (launchEnv['OCTOPUS_CLI_API_KEY'] = value)
    )

    this.pickupConfigurationValueExtended(
      parameters.server,
      'OCTOPUS_CLI_SERVER',
      'OCTOPUS_HOST',
      value => (launchEnv['OCTOPUS_CLI_SERVER'] = value)
    )

    this.pickupConfigurationValue(parameters.space, 'OCTOPUS_SPACE', value => launchArgs.push(`--space=${value}`))

    this.pickupConfigurationValue(parameters.proxy, 'OCTOPUS_PROXY', value => launchArgs.push(`--proxy=${value}`))
    this.pickupConfigurationValue(parameters.proxyUsername, 'OCTOPUS_PROXY_USERNAME', value =>
      launchArgs.push(`--proxyUser=${value}`)
    )
    this.pickupConfigurationValue(parameters.proxyPassword, 'OCTOPUS_PROXY_PASSWORD', value =>
      launchArgs.push(`--proxyPass=${value}`)
    )

    if (parameters.debug) launchArgs.push(`--debug`)

    if (parameters.overwriteMode.length > 0 && parameters.overwriteMode !== 'FailIfExists') {
      if (parameters.overwriteMode !== 'OverwriteExisting' && parameters.overwriteMode !== 'IgnoreIfExists') {
        setFailed(
          'The input value, overwrite_mode is invalid; accept values are "FailIfExists", "OverwriteExisting", and "IgnoreIfExists".'
        )
      }
      launchArgs.push(`--overwrite-mode=${parameters.overwriteMode}`)
    }

    for (const pkg of parameters.packages) {
      pkg.split(',').map(p => launchArgs.push(`--package=${p}`))
    }

    if (parameters.logLevel.length > 0 && parameters.logLevel !== `debug`)
      launchArgs.push(`--logLevel=${parameters.logLevel}`)
    if (parameters.timeout.length > 0 && parameters.timeout !== `600`)
      launchArgs.push(`--timeout=${parameters.timeout}`)
    if (!parameters.useDeltaCompression) launchArgs.push(`--use-delta-compression=false`)

    return { args: launchArgs, env: launchEnv }
  }

  async createBuildSummary(): Promise<void> {
    if (this.pushedPackages.length > 0) {
      await summary
        .addHeading(`🎉 Package${this.pushedPackages.length > 1 ? 's' : ''} successfully pushed to Octopus Deploy`)
        .addList(this.pushedPackages.map(pkg => `📦 ${pkg}`))
        .write()
    }
  }

  async pushPackage(): Promise<void> {
    info('🔣 Parsing inputs...')
    const cliLaunchConfiguration = this.generateLaunchConfig()

    const options: ExecOptions = {
      listeners: {
        stdline: input => this.stdline(input)
      },
      env: cliLaunchConfiguration.env,
      silent: true
    }

    try {
      await exec('octo', cliLaunchConfiguration.args, options)
    } catch (e: unknown) {
      if (e instanceof Error) {
        setFailed(e)
      }
    }
  }
}

export interface CliLaunchConfiguration {
  args: string[]
  env: { [key: string]: string }
}
