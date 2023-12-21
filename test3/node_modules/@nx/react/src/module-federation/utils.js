"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModuleFederationConfig = exports.getFunctionDeterminateRemoteUrl = void 0;
const tslib_1 = require("tslib");
const module_federation_1 = require("@nx/devkit/src/utils/module-federation");
const devkit_1 = require("@nx/devkit");
const project_graph_1 = require("nx/src/project-graph/project-graph");
function getFunctionDeterminateRemoteUrl(isServer = false) {
    const target = isServer ? 'serve-server' : 'serve';
    const remoteEntry = isServer ? 'server/remoteEntry.js' : 'remoteEntry.js';
    return function (remote) {
        var _a, _b, _c, _d, _e;
        const remoteConfiguration = (0, project_graph_1.readCachedProjectConfiguration)(remote);
        const serveTarget = (_a = remoteConfiguration === null || remoteConfiguration === void 0 ? void 0 : remoteConfiguration.targets) === null || _a === void 0 ? void 0 : _a[target];
        if (!serveTarget) {
            throw new Error(`Cannot automatically determine URL of remote (${remote}). Looked for property "host" in the project's "${serveTarget}" target.\n
      You can also use the tuple syntax in your webpack config to configure your remotes. e.g. \`remotes: [['remote1', 'http://localhost:4201']]\``);
        }
        const host = (_c = (_b = serveTarget.options) === null || _b === void 0 ? void 0 : _b.host) !== null && _c !== void 0 ? _c : `http${serveTarget.options.ssl ? 's' : ''}://localhost`;
        const port = (_e = (_d = serveTarget.options) === null || _d === void 0 ? void 0 : _d.port) !== null && _e !== void 0 ? _e : 4201;
        return `${host.endsWith('/') ? host.slice(0, -1) : host}:${port}/${remoteEntry}`;
    };
}
exports.getFunctionDeterminateRemoteUrl = getFunctionDeterminateRemoteUrl;
function getModuleFederationConfig(mfConfig, options = { isServer: false }) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let projectGraph;
        try {
            projectGraph = (0, devkit_1.readCachedProjectGraph)();
        }
        catch (e) {
            projectGraph = yield (0, devkit_1.createProjectGraphAsync)();
        }
        const project = (_a = projectGraph.nodes[mfConfig.name]) === null || _a === void 0 ? void 0 : _a.data;
        if (!project) {
            throw Error(`Cannot find project "${mfConfig.name}". Check that the name is correct in module-federation.config.js`);
        }
        const dependencies = (0, module_federation_1.getDependentPackagesForProject)(projectGraph, mfConfig.name);
        if (mfConfig.shared) {
            dependencies.workspaceLibraries = dependencies.workspaceLibraries.filter((lib) => mfConfig.shared(lib.importKey, {}) !== false);
            dependencies.npmPackages = dependencies.npmPackages.filter((pkg) => mfConfig.shared(pkg, {}) !== false);
        }
        const sharedLibraries = (0, module_federation_1.shareWorkspaceLibraries)(dependencies.workspaceLibraries);
        const npmPackages = (0, module_federation_1.sharePackages)(dependencies.npmPackages);
        const sharedDependencies = Object.assign(Object.assign({}, sharedLibraries.getLibraries()), npmPackages);
        (0, module_federation_1.applySharedFunction)(sharedDependencies, mfConfig.shared);
        (0, module_federation_1.applyAdditionalShared)(sharedDependencies, mfConfig.additionalShared, projectGraph);
        const mapRemotesFunction = options.isServer ? module_federation_1.mapRemotesForSSR : module_federation_1.mapRemotes;
        const determineRemoteUrlFn = options.determineRemoteUrl ||
            getFunctionDeterminateRemoteUrl(options.isServer);
        const mappedRemotes = !mfConfig.remotes || mfConfig.remotes.length === 0
            ? {}
            : mapRemotesFunction(mfConfig.remotes, 'js', determineRemoteUrlFn);
        return { sharedLibraries, sharedDependencies, mappedRemotes };
    });
}
exports.getModuleFederationConfig = getModuleFederationConfig;
