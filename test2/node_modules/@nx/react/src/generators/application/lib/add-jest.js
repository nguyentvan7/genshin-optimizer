"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addJest = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nx/devkit");
const versions_1 = require("../../../utils/versions");
function addJest(host, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { jestProjectGenerator } = (0, devkit_1.ensurePackage)('@nx/jest', versions_1.nxVersion);
        if (options.unitTestRunner !== 'jest') {
            return () => { };
        }
        return yield jestProjectGenerator(host, Object.assign(Object.assign({}, options), { project: options.projectName, supportTsx: true, skipSerializers: true, setupFile: 'none', compiler: options.compiler, skipFormat: true }));
    });
}
exports.addJest = addJest;
