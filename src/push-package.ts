import {InputParameters} from './input-parameters'
import * as core from '@actions/core'
import * as exec from '@actions/exec'

function getArgs(parameters: InputParameters): string[] {
  core.info('🔣 Parsing inputs...')

  const args = ['push']

  if (parameters.apiKey.length > 0) args.push(`--apiKey=${parameters.apiKey}`)
  if (parameters.configFile.length > 0)
    args.push(`--configFile=${parameters.configFile}`)
  if (parameters.debug) args.push(`--debug`)
  if (parameters.ignoreSslErrors) args.push(`--ignoreSslErrors`)
  if (parameters.logLevel.length > 0 && parameters.logLevel !== `debug`)
    args.push(`--logLevel=${parameters.logLevel}`)

  if (
    parameters.overwriteMode.length > 0 &&
    parameters.overwriteMode !== 'FailIfExists'
  ) {
    if (
      parameters.overwriteMode !== 'OverwriteExisting' &&
      parameters.overwriteMode !== 'IgnoreIfExists'
    ) {
      core.setFailed(
        'The input value, overwrite_mode is invalid; accept values are "FailIfExists", "OverwriteExisting", and "IgnoreIfExists".'
      )
    }
    args.push(`--overwrite-mode=${parameters.overwriteMode}`)
  }

  if (parameters.packages.length > 0) {
    for (const iterator of parameters.packages.split(',')) {
      if (iterator.length > 0) {
        args.push(`--package=${iterator}`)
      }
    }
  }

  if (parameters.password.length > 0) args.push(`--pass=${parameters.password}`)
  if (parameters.proxy.length > 0) args.push(`--proxy=${parameters.proxy}`)
  if (parameters.proxyPassword.length > 0)
    args.push(`--proxyPass=${parameters.proxyPassword}`)
  if (parameters.proxyUsername.length > 0)
    args.push(`--proxyUser=${parameters.proxyUsername}`)
  if (parameters.releaseExisting.length > 0)
    args.push(`--releaseExisting=${parameters.releaseExisting}`)
  if (parameters.server.length > 0) args.push(`--server=${parameters.server}`)
  if (parameters.space.length > 0) args.push(`--space=${parameters.space}`)
  if (parameters.logLevel.length > 0 && parameters.logLevel !== `600`)
    args.push(`--timeout=${parameters.timeout}`)
  if (parameters.timeout.length > 0 && parameters.timeout !== `600`)
    args.push(`--timeout=${parameters.timeout}`)
  if (parameters.useDeltaCompression)
    args.push(`--use-delta-compression=${parameters.useDeltaCompression}`)
  if (parameters.username.length > 0) args.push(`--user=${parameters.username}`)

  return args
}

export async function pushPackage(parameters: InputParameters): Promise<void> {
  const args = getArgs(parameters)

  const options: exec.ExecOptions = {
    ignoreReturnCode: true,
    listeners: {
      errline: (line: string) => {
        core.error(line)
      },
      stdline: (line: string) => {
        if (line.length <= 0) return

        if (line.includes('Octopus Deploy Command Line Tool')) {
          const version = line.split('version ')[1]
          core.info(`🐙 Using Octopus Deploy CLI ${version}...`)
          return
        }

        if (line.includes('Handshaking with Octopus Server')) {
          core.info(`🤝 Handshaking with Octopus Deploy`)
          return
        }

        if (line.includes('Authenticated as:')) {
          core.info(`✅ Authenticated`)
          return
        }

        if (line === 'Push successful') {
          core.info(`🎉 Push successful!`)
          return
        }

        core.info(line)
      }
    },
    silent: true
  }

  await exec.exec('octo', args, options)
}
