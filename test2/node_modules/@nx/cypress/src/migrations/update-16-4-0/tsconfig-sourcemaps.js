"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixLegacyCypressTsconfig = void 0;
const tslib_1 = require("tslib");
const executor_options_utils_1 = require("@nx/devkit/src/generators/executor-options-utils");
const devkit_1 = require("@nx/devkit");
const path_1 = require("path");
function fixLegacyCypressTsconfig(tree) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const projects = (0, devkit_1.getProjects)(tree);
        (0, executor_options_utils_1.forEachExecutorOptions)(tree, '@nx/cypress:cypress', (options, projectName, targetName, configName) => {
            var _a, _b, _c;
            const projectConfig = projects.get(projectName);
            if (options.testingType !== 'e2e' &&
                ((_b = (_a = projectConfig.targets[targetName]) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.testingType) !== 'e2e') {
                return;
            }
            const tsconfigToRemove = (_c = options.tsConfig) !== null && _c !== void 0 ? _c : (0, devkit_1.joinPathFragments)(projectConfig.root, 'tsconfig.e2e.json');
            const projectLevelConfigPath = (0, devkit_1.joinPathFragments)(projectConfig.root, 'tsconfig.json');
            if (!tree.exists(projectLevelConfigPath) ||
                !tree.exists(tsconfigToRemove)) {
                return;
            }
            if (tsconfigToRemove === projectLevelConfigPath) {
                (0, devkit_1.updateJson)(tree, projectLevelConfigPath, (json) => {
                    json.compilerOptions = Object.assign({ sourceMap: false }, json.compilerOptions);
                    return json;
                });
            }
            else {
                const e2eConfig = (0, devkit_1.readJson)(tree, tsconfigToRemove);
                (0, devkit_1.updateJson)(tree, projectLevelConfigPath, (json) => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    json.compilerOptions = Object.assign(Object.assign({ sourceMap: false }, json.compilerOptions), e2eConfig.compilerOptions);
                    json.files = Array.from(new Set([...((_a = json.files) !== null && _a !== void 0 ? _a : []), ...((_b = e2eConfig.files) !== null && _b !== void 0 ? _b : [])]));
                    json.include = Array.from(new Set([...((_c = json.include) !== null && _c !== void 0 ? _c : []), ...((_d = e2eConfig.include) !== null && _d !== void 0 ? _d : [])]));
                    json.exclude = Array.from(new Set([...((_e = json.exclude) !== null && _e !== void 0 ? _e : []), ...((_f = e2eConfig.exclude) !== null && _f !== void 0 ? _f : [])]));
                    // these paths will always be 'unix style'
                    // and on windows relative will not work on these paths
                    const tsConfigFromProjRoot = path_1.posix.relative(projectConfig.root, tsconfigToRemove);
                    json.references = ((_g = json.references) !== null && _g !== void 0 ? _g : []).filter(({ path }) => !path.includes(tsConfigFromProjRoot));
                    return json;
                });
                tree.delete(tsconfigToRemove);
            }
            if (configName) {
                delete projectConfig.targets[targetName].configurations[configName]
                    .tsConfig;
            }
            else {
                delete projectConfig.targets[targetName].options.tsConfig;
            }
            (0, devkit_1.updateProjectConfiguration)(tree, projectName, projectConfig);
        });
        yield (0, devkit_1.formatFiles)(tree);
    });
}
exports.fixLegacyCypressTsconfig = fixLegacyCypressTsconfig;
exports.default = fixLegacyCypressTsconfig;
