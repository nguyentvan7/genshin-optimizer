"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withModuleFederationForSSR = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("./utils");
function withModuleFederationForSSR(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { sharedLibraries, sharedDependencies, mappedRemotes } = yield (0, utils_1.getModuleFederationConfig)(options, {
            isServer: true,
        });
        return (config) => {
            config.target = false;
            config.output.uniqueName = options.name;
            config.optimization = {
                runtimeChunk: false,
            };
            config.plugins.push(new (require('@module-federation/node').UniversalFederationPlugin)({
                name: options.name,
                filename: 'remoteEntry.js',
                exposes: options.exposes,
                remotes: mappedRemotes,
                shared: Object.assign({}, sharedDependencies),
                library: {
                    type: 'commonjs-module',
                },
                isServer: true,
            }, {}), sharedLibraries.getReplacementPlugin());
            return config;
        };
    });
}
exports.withModuleFederationForSSR = withModuleFederationForSSR;
