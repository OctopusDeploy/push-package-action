import {getBooleanInput, getMultilineInput, getInput} from '@actions/core'

export interface InputParameters {
  // required parameters
  packages: string[]
  apiKey: string
  server: string
  space: string
  // optional parameters
  debug?: boolean
  logLevel: string
  overwriteMode: string
  proxy: string
  proxyPassword: string
  proxyUsername: string
  timeout: string
  useDeltaCompression: boolean
}

export function getInputParameters(): InputParameters {
  return {
    // required parameters
    packages: getMultilineInput('packages'),
    apiKey: getInput('api_key'),
    server: getInput('server'),
    space: getInput('space'),
    // optional parameters
    debug: getBooleanInput('debug'),
    logLevel: getInput('log_level'),
    overwriteMode: getInput('overwrite_mode'),
    proxy: getInput('proxy'),
    proxyPassword: getInput('proxy_password'),
    proxyUsername: getInput('proxy_username'),
    timeout: getInput('timeout'),
    useDeltaCompression: getBooleanInput('use_delta_compression'),
  }
}
