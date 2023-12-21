"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const devkit_1 = require("@nx/devkit");
function removePackage(tree) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, devkit_1.removeDependenciesFromPackageJson)(tree, [], ['react-test-renderer']);
        yield (0, devkit_1.formatFiles)(tree);
    });
}
exports.default = removePackage;
