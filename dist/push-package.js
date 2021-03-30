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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushPackage = void 0;
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
function getArgs(parameters) {
    core.info('🔣 Parsing inputs...');
    const args = ['push'];
    if (parameters.apiKey.length > 0)
        args.push(`--apiKey=${parameters.apiKey}`);
    if (parameters.configFile.length > 0)
        args.push(`--configFile=${parameters.configFile}`);
    if (parameters.debug)
        args.push(`--debug`);
    if (parameters.ignoreSslErrors)
        args.push(`--ignoreSslErrors`);
    if (parameters.logLevel.length > 0 && parameters.logLevel !== `debug`)
        args.push(`--logLevel=${parameters.logLevel}`);
    if (parameters.overwriteMode.length > 0 &&
        parameters.overwriteMode !== 'FailIfExists') {
        if (parameters.overwriteMode !== 'OverwriteExisting' &&
            parameters.overwriteMode !== 'IgnoreIfExists') {
            core.setFailed('The input value, overwrite_mode is invalid; accept values are "FailIfExists", "OverwriteExisting", and "IgnoreIfExists".');
        }
        args.push(`--overwrite-mode=${parameters.overwriteMode}`);
    }
    if (parameters.packages.length > 0) {
        for (const iterator of parameters.packages.split(',')) {
            if (iterator.length > 0) {
                args.push(`--package=${iterator}`);
            }
        }
    }
    if (parameters.password.length > 0)
        args.push(`--pass=${parameters.password}`);
    if (parameters.proxy.length > 0)
        args.push(`--proxy=${parameters.proxy}`);
    if (parameters.proxyPassword.length > 0)
        args.push(`--proxyPass=${parameters.proxyPassword}`);
    if (parameters.proxyUsername.length > 0)
        args.push(`--proxyUser=${parameters.proxyUsername}`);
    if (parameters.releaseExisting.length > 0)
        args.push(`--releaseExisting=${parameters.releaseExisting}`);
    if (parameters.server.length > 0)
        args.push(`--server=${parameters.server}`);
    if (parameters.space.length > 0)
        args.push(`--space=${parameters.space}`);
    if (parameters.logLevel.length > 0 && parameters.logLevel !== `600`)
        args.push(`--timeout=${parameters.timeout}`);
    if (parameters.timeout.length > 0 && parameters.timeout !== `600`)
        args.push(`--timeout=${parameters.timeout}`);
    if (parameters.useDeltaCompression)
        args.push(`--use-delta-compression=${parameters.useDeltaCompression}`);
    if (parameters.username.length > 0)
        args.push(`--user=${parameters.username}`);
    return args;
}
function pushPackage(parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        const args = getArgs(parameters);
        const options = {
            ignoreReturnCode: true,
            listeners: {
                errline: (line) => {
                    core.error(line);
                },
                stdline: (line) => {
                    if (line.length <= 0)
                        return;
                    if (line.includes('Octopus Deploy Command Line Tool')) {
                        const version = line.split('version ')[1];
                        core.info(`🐙 Using Octopus Deploy CLI ${version}...`);
                        return;
                    }
                    if (line.includes('Handshaking with Octopus Server')) {
                        core.info(`🤝 Handshaking with Octopus Deploy`);
                        return;
                    }
                    if (line.includes('Authenticated as:')) {
                        core.info(`✅ Authenticated`);
                        return;
                    }
                    if (line === 'Push successful') {
                        core.info(`🎉 Push successful!`);
                        return;
                    }
                    core.info(line);
                }
            },
            silent: true
        };
        yield exec.exec('octo', args, options);
    });
}
exports.pushPackage = pushPackage;
