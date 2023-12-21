"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLib = exports.createApp = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nx/devkit");
const application_1 = require("../generators/application/application");
const linter_1 = require("@nx/linter");
function createApp(tree, appName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield (0, application_1.default)(tree, {
            e2eTestRunner: 'none',
            linter: linter_1.Linter.EsLint,
            skipFormat: true,
            style: 'css',
            unitTestRunner: 'none',
            name: appName,
        });
    });
}
exports.createApp = createApp;
function createLib(tree, libName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { fileName } = (0, devkit_1.names)(libName);
        tree.write(`/libs/${fileName}/src/index.ts`, `import React from 'react';\n`);
        (0, devkit_1.addProjectConfiguration)(tree, fileName, {
            tags: [],
            root: `libs/${fileName}`,
            projectType: 'library',
            sourceRoot: `libs/${fileName}/src`,
            targets: {},
        });
    });
}
exports.createLib = createLib;
