import * as core from '@actions/core'
import {getBooleanInput} from './get-boolean-input'

export interface InputParameters {
  apiKey: string
  configFile: string
  debug: boolean
  ignoreSslErrors: boolean
  logLevel: string
  overwriteMode: string
  packages: string
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
    apiKey: core.getInput('api_key'),
    configFile: core.getInput('config_file'),
    debug: getBooleanInput('debug'),
    ignoreSslErrors: getBooleanInput('ignore_ssl_errors'),
    logLevel: core.getInput('log_level'),
    overwriteMode: core.getInput('overwrite_mode'),
    packages: core.getInput('packages'),
    password: core.getInput('password'),
    proxy: core.getInput('proxy'),
    proxyPassword: core.getInput('proxy_password'),
    proxyUsername: core.getInput('proxy_username'),
    releaseExisting: core.getInput('release_existing'),
    server: core.getInput('server'),
    space: core.getInput('space'),
    timeout: core.getInput('timeout'),
    useDeltaCompression: getBooleanInput('use_delta_compression'),
    username: core.getInput('user')
  }
}
