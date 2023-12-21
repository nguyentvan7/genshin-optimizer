"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationSchematic = exports.applicationGenerator = void 0;
const tslib_1 = require("tslib");
const lint_1 = require("../../utils/lint");
const create_application_files_1 = require("./lib/create-application-files");
const update_jest_config_1 = require("./lib/update-jest-config");
const normalize_options_1 = require("./lib/normalize-options");
const add_project_1 = require("./lib/add-project");
const add_cypress_1 = require("./lib/add-cypress");
const add_jest_1 = require("./lib/add-jest");
const add_routing_1 = require("./lib/add-routing");
const set_defaults_1 = require("./lib/set-defaults");
const add_styled_dependencies_1 = require("../../rules/add-styled-dependencies");
const devkit_1 = require("@nx/devkit");
const init_1 = require("../init/init");
const linter_1 = require("@nx/linter");
const lint_project_1 = require("@nx/linter/src/generators/lint-project/lint-project");
const versions_1 = require("../../utils/versions");
const install_common_dependencies_1 = require("./lib/install-common-dependencies");
const create_ts_config_1 = require("../../utils/create-ts-config");
const add_swc_dependencies_1 = require("@nx/js/src/utils/swc/add-swc-dependencies");
const chalk = require("chalk");
const show_possible_warnings_1 = require("./lib/show-possible-warnings");
function addLinting(host, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tasks = [];
        if (options.linter === linter_1.Linter.EsLint) {
            const lintTask = yield (0, linter_1.lintProjectGenerator)(host, {
                linter: options.linter,
                project: options.projectName,
                tsConfigPaths: [
                    (0, devkit_1.joinPathFragments)(options.appProjectRoot, 'tsconfig.app.json'),
                ],
                unitTestRunner: options.unitTestRunner,
                eslintFilePatterns: [
                    (0, lint_project_1.mapLintPattern)(options.appProjectRoot, '{ts,tsx,js,jsx}', options.rootProject),
                ],
                skipFormat: true,
                rootProject: options.rootProject,
                skipPackageJson: options.skipPackageJson,
            });
            tasks.push(lintTask);
            (0, devkit_1.updateJson)(host, (0, devkit_1.joinPathFragments)(options.appProjectRoot, '.eslintrc.json'), lint_1.extendReactEslintJson);
            if (!options.skipPackageJson) {
                const installTask = yield (0, devkit_1.addDependenciesToPackageJson)(host, lint_1.extraEslintDependencies.dependencies, lint_1.extraEslintDependencies.devDependencies);
                const addSwcTask = (0, add_swc_dependencies_1.addSwcDependencies)(host);
                tasks.push(installTask, addSwcTask);
            }
        }
        return (0, devkit_1.runTasksInSerial)(...tasks);
    });
}
function applicationGenerator(host, schema) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tasks = [];
        const options = (0, normalize_options_1.normalizeOptions)(host, schema);
        (0, show_possible_warnings_1.showPossibleWarnings)(host, options);
        const initTask = yield (0, init_1.default)(host, Object.assign(Object.assign({}, options), { skipFormat: true, skipHelperLibs: options.bundler === 'vite' }));
        tasks.push(initTask);
        if (!options.rootProject) {
            (0, create_ts_config_1.extractTsConfigBase)(host);
        }
        (0, create_application_files_1.createApplicationFiles)(host, options);
        (0, add_project_1.addProject)(host, options);
        if (options.bundler === 'vite') {
            const { viteConfigurationGenerator } = (0, devkit_1.ensurePackage)('@nx/vite', versions_1.nxVersion);
            // We recommend users use `import.meta.env.MODE` and other variables in their code to differentiate between production and development.
            // See: https://vitejs.dev/guide/env-and-mode.html
            if (host.exists((0, devkit_1.joinPathFragments)(options.appProjectRoot, 'src/environments'))) {
                host.delete((0, devkit_1.joinPathFragments)(options.appProjectRoot, 'src/environments'));
            }
            const viteTask = yield viteConfigurationGenerator(host, {
                uiFramework: 'react',
                project: options.projectName,
                newProject: true,
                includeVitest: options.unitTestRunner === 'vitest',
                inSourceTests: options.inSourceTests,
                compiler: options.compiler,
                skipFormat: true,
            });
            tasks.push(viteTask);
        }
        else if (options.bundler === 'webpack') {
            const { webpackInitGenerator } = (0, devkit_1.ensurePackage)('@nx/webpack', versions_1.nxVersion);
            const webpackInitTask = yield webpackInitGenerator(host, {
                uiFramework: 'react',
                skipFormat: true,
            });
            tasks.push(webpackInitTask);
        }
        else if (options.bundler === 'rspack') {
            const { configurationGenerator } = (0, devkit_1.ensurePackage)('@nx/rspack', versions_1.nxRspackVersion);
            const rspackTask = yield configurationGenerator(host, {
                project: options.projectName,
                main: (0, devkit_1.joinPathFragments)(options.appProjectRoot, (0, add_project_1.maybeJs)(options, `src/main.tsx`)),
                tsConfig: (0, devkit_1.joinPathFragments)(options.appProjectRoot, 'tsconfig.app.json'),
                target: 'web',
                newProject: true,
                uiFramework: 'react',
            });
            tasks.push(rspackTask);
        }
        if (options.bundler !== 'vite' && options.unitTestRunner === 'vitest') {
            const { vitestGenerator } = (0, devkit_1.ensurePackage)('@nx/vite', versions_1.nxVersion);
            const vitestTask = yield vitestGenerator(host, {
                uiFramework: 'react',
                coverageProvider: 'c8',
                project: options.projectName,
                inSourceTests: options.inSourceTests,
                skipFormat: true,
            });
            tasks.push(vitestTask);
        }
        if ((options.bundler === 'vite' || options.unitTestRunner === 'vitest') &&
            options.inSourceTests) {
            host.delete((0, devkit_1.joinPathFragments)(options.appProjectRoot, `src/app/${options.fileName}.spec.tsx`));
        }
        const lintTask = yield addLinting(host, options);
        tasks.push(lintTask);
        const cypressTask = yield (0, add_cypress_1.addCypress)(host, options);
        tasks.push(cypressTask);
        if (options.unitTestRunner === 'jest') {
            const jestTask = yield (0, add_jest_1.addJest)(host, options);
            tasks.push(jestTask);
        }
        // Handle tsconfig.spec.json for jest or vitest
        (0, update_jest_config_1.updateSpecConfig)(host, options);
        const stylePreprocessorTask = (0, install_common_dependencies_1.installCommonDependencies)(host, options);
        tasks.push(stylePreprocessorTask);
        const styledTask = (0, add_styled_dependencies_1.addStyledModuleDependencies)(host, options);
        tasks.push(styledTask);
        const routingTask = (0, add_routing_1.addRouting)(host, options);
        tasks.push(routingTask);
        (0, set_defaults_1.setDefaults)(host, options);
        if (options.bundler === 'rspack' && options.style === 'styled-jsx') {
            devkit_1.logger.warn(`${chalk.bold('styled-jsx')} is not supported by ${chalk.bold('Rspack')}. We've added ${chalk.bold('babel-loader')} to your project, but using babel will slow down your build.`);
            tasks.push((0, devkit_1.addDependenciesToPackageJson)(host, {}, { 'babel-loader': versions_1.babelLoaderVersion }));
            host.write((0, devkit_1.joinPathFragments)(options.appProjectRoot, 'rspack.config.js'), (0, devkit_1.stripIndents) `
        const { composePlugins, withNx, withWeb } = require('@nx/rspack');
        module.exports = composePlugins(withNx(), withWeb(), (config) => {
          config.module.rules.push({
            test: /\\.[jt]sx$/i,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-typescript'],
                  plugins: ['styled-jsx/babel'],
                },
              },
            ],
          });
          return config;
        });
        `);
        }
        if (!options.skipFormat) {
            yield (0, devkit_1.formatFiles)(host);
        }
        return (0, devkit_1.runTasksInSerial)(...tasks);
    });
}
exports.applicationGenerator = applicationGenerator;
exports.default = applicationGenerator;
exports.applicationSchematic = (0, devkit_1.convertNxGenerator)(applicationGenerator);
