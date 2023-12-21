"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFiles = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nx/devkit");
const versions_1 = require("nx/src/utils/versions");
const component_test_1 = require("../../component-test/component-test");
const ct_utils_1 = require("../../../utils/ct-utils");
function addFiles(tree, projectConfig, options, found) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // must dyanmicaly import to prevent packages not using cypress from erroring out
        // when importing react
        const { addMountDefinition, addDefaultCTConfig } = yield Promise.resolve().then(() => require('@nx/cypress/src/utils/config'));
        // Specifically undefined to allow Remix workaround of passing an empty string
        const actualBundler = options.buildTarget !== undefined && options.bundler
            ? options.bundler
            : yield (0, ct_utils_1.getBundlerFromTarget)(found, tree);
        if (options.bundler && options.bundler !== actualBundler) {
            devkit_1.logger.warn(`You have specified ${options.bundler} as the bundler but this project is configured to use ${actualBundler}.
      This may cause errors. If you are seeing errors, try removing the --bundler option.`);
        }
        const bundlerToUse = (_a = options.bundler) !== null && _a !== void 0 ? _a : actualBundler;
        const commandFile = (0, devkit_1.joinPathFragments)(projectConfig.root, 'cypress', 'support', 'component.ts');
        const updatedCommandFile = yield addMountDefinition(tree.read(commandFile, 'utf-8'));
        tree.write(commandFile, `import { mount } from 'cypress/react18';\n${updatedCommandFile}`);
        const cyFile = (0, devkit_1.joinPathFragments)(projectConfig.root, 'cypress.config.ts');
        const updatedCyConfig = yield addDefaultCTConfig(tree.read(cyFile, 'utf-8'), { bundler: bundlerToUse });
        tree.write(cyFile, `import { nxComponentTestingPreset } from '@nx/react/plugins/component-testing';\n${updatedCyConfig}`);
        if (options.bundler === 'webpack' ||
            (!options.bundler && actualBundler === 'webpack')) {
            (0, devkit_1.addDependenciesToPackageJson)(tree, {}, { '@nx/webpack': versions_1.nxVersion });
        }
        if (options.bundler === 'vite' ||
            (!options.bundler && actualBundler === 'vite')) {
            (0, devkit_1.addDependenciesToPackageJson)(tree, {}, { '@nx/vite': versions_1.nxVersion });
        }
        if (options.generateTests) {
            const filePaths = [];
            (0, devkit_1.visitNotIgnoredFiles)(tree, projectConfig.sourceRoot, (filePath) => {
                if ((0, ct_utils_1.isComponent)(tree, filePath)) {
                    filePaths.push(filePath);
                }
            });
            for (const filePath of filePaths) {
                yield (0, component_test_1.componentTestGenerator)(tree, {
                    project: options.project,
                    componentPath: filePath,
                });
            }
        }
    });
}
exports.addFiles = addFiles;
