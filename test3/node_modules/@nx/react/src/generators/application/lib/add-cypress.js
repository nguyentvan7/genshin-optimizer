"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCypress = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nx/devkit");
const web_1 = require("@nx/web");
const versions_1 = require("../../../utils/versions");
function addCypress(host, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (options.e2eTestRunner !== 'cypress') {
            return () => { };
        }
        yield (0, web_1.webStaticServeGenerator)(host, {
            buildTarget: `${options.projectName}:build`,
            targetName: 'serve-static',
        });
        const { cypressProjectGenerator } = (0, devkit_1.ensurePackage)('@nx/cypress', versions_1.nxVersion);
        return yield cypressProjectGenerator(host, Object.assign(Object.assign({}, options), { name: options.e2eProjectName, directory: options.directory, project: options.projectName, bundler: options.bundler === 'rspack' ? 'webpack' : options.bundler, skipFormat: true }));
    });
}
exports.addCypress = addCypress;
