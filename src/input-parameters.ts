import {getBooleanInput, getMultilineInput, getInput} from '@actions/core'

export interface InputParameters {
  apiKey: string
  configFile: string
  debug: boolean
  ignoreSslErrors: boolean
  logLevel: string
  overwriteMode: string
  packages: string[]
  password: string
  proxy: string
  proxyPassword: string
  proxyUsername: string
  releaseExisting: string
  server: string
  space: string
  timeout: string
  useDeltaCompression: boolean
  username: string
}

export function get(): InputParameters {
  return {
    apiKey: getInput('api_key'),
    configFile: getInput('config_file'),
    debug: getBooleanInput('debug'),
    ignoreSslErrors: getBooleanInput('ignore_ssl_errors'),
    logLevel: getInput('log_level'),
    overwriteMode: getInput('overwrite_mode'),
    packages: getMultilineInput('packages'),
    password: getInput('password'),
    proxy: getInput('proxy'),
    proxyPassword: getInput('proxy_password'),
    proxyUsername: getInput('proxy_username'),
    releaseExisting: getInput('release_existing'),
    server: getInput('server'),
    space: getInput('space'),
    timeout: getInput('timeout'),
    useDeltaCompression: getBooleanInput('use_delta_compression'),
    username: getInput('user')
  }
}
