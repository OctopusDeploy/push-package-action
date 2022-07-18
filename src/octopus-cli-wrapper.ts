import { summary } from '@actions/core'
import { exec, ExecOptions } from '@actions/exec'
import {
  CliOutput,
  CliLaunchConfiguration,
  EnvVars,
  pickupConfigurationValue,
  pickupConfigurationValueExtended
} from './cli-util'
import { InputParameters } from './input-parameters'

// Things in this file are specific to create-release-action and not shared with other actions

export interface CliInputs {
  parameters: InputParameters
  env: EnvVars
}

// Converts incoming environment and inputParameters into a set of commandline args + env vars to run the Octopus CLI
export function generateLaunchConfig(inputs: CliInputs, output: CliOutput): CliLaunchConfiguration {
  const launchArgs: string[] = ['push']
  const launchEnv: { [key: string]: string } = {}

  const parameters = inputs.parameters

  pickupConfigurationValueExtended(
    output,
    inputs.env,
    parameters.apiKey,
    'OCTOPUS_CLI_API_KEY',
    'OCTOPUS_API_KEY',
    value => (launchEnv['OCTOPUS_CLI_API_KEY'] = value)
  )

  pickupConfigurationValueExtended(
    output,
    inputs.env,
    parameters.server,
    'OCTOPUS_CLI_SERVER',
    'OCTOPUS_HOST',
    value => (launchEnv['OCTOPUS_CLI_SERVER'] = value)
  )

  pickupConfigurationValue(inputs.env, parameters.space, 'OCTOPUS_SPACE', value => launchArgs.push(`--space=${value}`))

  pickupConfigurationValue(inputs.env, parameters.proxy, 'OCTOPUS_PROXY', value => launchArgs.push(`--proxy=${value}`))
  pickupConfigurationValue(inputs.env, parameters.proxyUsername, 'OCTOPUS_PROXY_USERNAME', value =>
    launchArgs.push(`--proxyUser=${value}`)
  )
  pickupConfigurationValue(inputs.env, parameters.proxyPassword, 'OCTOPUS_PROXY_PASSWORD', value =>
    launchArgs.push(`--proxyPass=${value}`)
  )

  if (parameters.debug) launchArgs.push(`--debug`)

  if (parameters.overwriteMode.length > 0 && parameters.overwriteMode !== 'FailIfExists') {
    if (parameters.overwriteMode !== 'OverwriteExisting' && parameters.overwriteMode !== 'IgnoreIfExists') {
      throw new Error(
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
  if (parameters.timeout.length > 0 && parameters.timeout !== `600`) launchArgs.push(`--timeout=${parameters.timeout}`)
  if (!parameters.useDeltaCompression) launchArgs.push(`--use-delta-compression=false`)

  return { args: launchArgs, env: launchEnv }
}

// consumes stdline and errline from the child process
// and transforms/buffers output as needed
export class OctopusCliOutputHandler {
  readonly output: CliOutput

  // buffer packages here for the job summary
  pushedPackages: string[] = []
  success = false

  constructor(output: CliOutput) {
    this.output = output
  }

  // public: attach this to the process errline
  errline(line: string): void {
    if (line.length === 0) {
      return
    }
    this.output.warn(line)
  }

  // public: attach this to the process stdline
  stdline(line: string): void {
    if (line.length <= 0) return

    if (line.includes('Octopus Deploy Command Line Tool')) {
      const version = line.split('version ')[1]
      this.output.info(`🐙 Using Octopus Deploy CLI ${version}...`)
      return
    }

    if (line.includes('Handshaking with Octopus Server')) {
      this.output.info(`🤝 Handshaking with Octopus Deploy`)
      return
    }

    if (line.includes('Authenticated as:')) {
      this.output.info(`✅ Authenticated`)
      return
    }

    if (line.includes('Pushing package:')) {
      const pkg = line.replace('Pushing package: ', '').replace('...', '')
      this.pushedPackages.push(pkg)

      this.output.info(`📦 Pushing ${pkg}`)
      return
    }

    switch (line) {
      case 'Push successful':
        this.output.info(`🎉 Push successful!`)
        this.success = true
        break
      default:
        this.output.info(line)
        break
    }
  }
}

export async function createBuildSummary(pushedPackages: string[]): Promise<void> {
  if (pushedPackages.length > 0) {
    await summary
      .addHeading(`🎉 Package${pushedPackages.length > 1 ? 's' : ''} successfully pushed to Octopus Deploy`, 3)
      .addCodeBlock(pushedPackages.map(pkg => `📦 ${pkg}`).join('\n'))
      .write()
  }
}

// This invokes the CLI to do the work.
// Returns the release number assigned by the octopus server
// This shells out to 'octo' and expects to be running in GHA, so you can't unit test it; integration tests only.
export async function pushPackage(
  inputs: CliInputs,
  output: CliOutput,
  octoExecutable: string
): Promise<{ success: boolean; pushedPackages: string[] }> {
  const outputHandler = new OctopusCliOutputHandler(output)

  const cliLaunchConfiguration = generateLaunchConfig(inputs, output)

  // the launch config will only have the specific few env vars that the script wants to set.
  // Need to merge with the rest of the environment variables, otherwise we will pass a
  // stripped environment through to the CLI and it won't have meaningful things like HOME and PATH
  const envCopy = { ...(process.env as { [key: string]: string }) }
  Object.assign(envCopy, cliLaunchConfiguration.env)

  const options: ExecOptions = {
    listeners: {
      stdline: input => outputHandler.stdline(input),
      errline: input => outputHandler.errline(input)
    },
    env: envCopy,
    silent: true
  }

  try {
    await exec(octoExecutable, cliLaunchConfiguration.args, options)
    return { success: outputHandler.success, pushedPackages: outputHandler.pushedPackages }
  } catch (e: unknown) {
    if (e instanceof Error) {
      // catch some particular messages and rethrow more convenient ones
      if (e.message.includes('Unable to locate executable file')) {
        throw new Error(
          `Octopus CLI executable missing. Ensure you have added the 'OctopusDeploy/install-octopus-cli-action@v1' step to your GitHub actions workflow.\nError: ${e.message}`
        )
      }
    }
    // rethrow, so our Promise is rejected. The GHA shim in index.ts will catch this and call setFailed
    throw e
  }
}
