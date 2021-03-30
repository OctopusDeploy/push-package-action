"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const core = __importStar(require("@actions/core"));
const get_boolean_input_1 = require("./get-boolean-input");
function get() {
    return {
        apiKey: core.getInput('api_key'),
        configFile: core.getInput('config_file'),
        debug: get_boolean_input_1.getBooleanInput('debug'),
        ignoreSslErrors: get_boolean_input_1.getBooleanInput('ignore_ssl_errors'),
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
        useDeltaCompression: get_boolean_input_1.getBooleanInput('use_delta_compression'),
        username: core.getInput('user')
    };
}
exports.get = get;
