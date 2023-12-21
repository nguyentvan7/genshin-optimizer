"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storybookConfigurationSchematic = exports.storybookConfigurationGenerator = void 0;
const tslib_1 = require("tslib");
const stories_1 = require("../stories/stories");
const devkit_1 = require("@nx/devkit");
const versions_1 = require("../../utils/versions");
function generateStories(host, schema) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, devkit_1.ensurePackage)('@nx/cypress', versions_1.nxVersion);
        const { getE2eProjectName } = yield Promise.resolve().then(() => require('@nx/cypress/src/utils/project-name'));
        const projectConfig = (0, devkit_1.readProjectConfiguration)(host, schema.name);
        const cypressProject = getE2eProjectName(schema.name, projectConfig.root, schema.cypressDirectory);
        yield (0, stories_1.default)(host, {
            project: schema.name,
            generateCypressSpecs: schema.configureCypress && schema.generateCypressSpecs,
            js: schema.js,
            cypressProject,
            ignorePaths: schema.ignorePaths,
            skipFormat: true,
        });
    });
}
function storybookConfigurationGenerator(host, schema) {
    var _a, _b;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { configurationGenerator } = (0, devkit_1.ensurePackage)('@nx/storybook', versions_1.nxVersion);
        let bundler = 'vite';
        const projectConfig = (0, devkit_1.readProjectConfiguration)(host, schema.name);
        if (projectConfig.projectType === 'application' &&
            (((_a = projectConfig.targets['build']) === null || _a === void 0 ? void 0 : _a.executor) === '@nx/webpack:webpack' ||
                ((_b = projectConfig.targets['build']) === null || _b === void 0 ? void 0 : _b.executor) === '@nrwl/webpack:webpack')) {
            bundler = 'webpack';
        }
        const installTask = yield configurationGenerator(host, {
            name: schema.name,
            configureCypress: schema.configureCypress,
            js: schema.js,
            linter: schema.linter,
            cypressDirectory: schema.cypressDirectory,
            tsConfiguration: schema.tsConfiguration,
            configureTestRunner: schema.configureTestRunner,
            configureStaticServe: schema.configureStaticServe,
            uiFramework: bundler === 'vite'
                ? '@storybook/react-vite'
                : '@storybook/react-webpack5',
            skipFormat: true,
        });
        if (schema.generateStories) {
            yield generateStories(host, schema);
        }
        yield (0, devkit_1.formatFiles)(host);
        return installTask;
    });
}
exports.storybookConfigurationGenerator = storybookConfigurationGenerator;
exports.default = storybookConfigurationGenerator;
exports.storybookConfigurationSchematic = (0, devkit_1.convertNxGenerator)(storybookConfigurationGenerator);
