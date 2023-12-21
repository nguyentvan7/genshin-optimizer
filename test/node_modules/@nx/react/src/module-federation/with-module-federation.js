"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withModuleFederation = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("./utils");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
/**
 * @param {ModuleFederationConfig} options
 * @return {Promise<AsyncNxWebpackPlugin>}
 */
function withModuleFederation(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { sharedDependencies, sharedLibraries, mappedRemotes } = yield (0, utils_1.getModuleFederationConfig)(options);
        return (config, ctx) => {
            var _a;
            config.output.uniqueName = options.name;
            config.output.publicPath = 'auto';
            config.optimization = {
                runtimeChunk: false,
            };
            config.experiments = Object.assign(Object.assign({}, config.experiments), { outputModule: true });
            config.plugins.push(new ModuleFederationPlugin({
                name: options.name,
                library: (_a = options.library) !== null && _a !== void 0 ? _a : { type: 'module' },
                filename: 'remoteEntry.js',
                exposes: options.exposes,
                remotes: mappedRemotes,
                shared: Object.assign({}, sharedDependencies),
            }), sharedLibraries.getReplacementPlugin());
            return config;
        };
    });
}
exports.withModuleFederation = withModuleFederation;
