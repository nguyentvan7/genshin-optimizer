"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cypressComponentConfigGenerator = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nx/devkit");
const versions_1 = require("../../utils/versions");
const add_files_1 = require("./lib/add-files");
const ct_utils_1 = require("../../utils/ct-utils");
/**
 * This is for using cypresses own Component testing, if you want to use test
 * storybook components then use componentCypressGenerator instead.
 *
 */
function cypressComponentConfigGenerator(tree, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { cypressComponentConfiguration: baseCyCtConfig } = (0, devkit_1.ensurePackage)('@nx/cypress', versions_1.nxVersion);
        const projectConfig = (0, devkit_1.readProjectConfiguration)(tree, options.project);
        const installTask = yield baseCyCtConfig(tree, {
            project: options.project,
            skipFormat: true,
        });
        const found = yield (0, ct_utils_1.addCTTargetWithBuildTarget)(tree, {
            project: options.project,
            buildTarget: options.buildTarget,
            validExecutorNames: new Set([
                '@nx/webpack:webpack',
                '@nx/vite:build',
                '@nrwl/webpack:webpack',
                '@nrwl/vite:build',
            ]),
        });
        yield (0, add_files_1.addFiles)(tree, projectConfig, options, found);
        if (!options.skipFormat) {
            yield (0, devkit_1.formatFiles)(tree);
        }
        return () => {
            installTask();
        };
    });
}
exports.cypressComponentConfigGenerator = cypressComponentConfigGenerator;
exports.default = cypressComponentConfigGenerator;
