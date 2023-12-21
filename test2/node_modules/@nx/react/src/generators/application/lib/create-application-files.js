"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationFiles = void 0;
const devkit_1 = require("@nx/devkit");
const js_1 = require("@nx/js");
const path_1 = require("path");
const create_ts_config_1 = require("../../../utils/create-ts-config");
const get_in_source_vitest_tests_template_1 = require("../../../utils/get-in-source-vitest-tests-template");
const get_app_tests_1 = require("./get-app-tests");
function createApplicationFiles(host, options) {
    let styleSolutionSpecificAppFiles;
    if (options.styledModule && options.style !== 'styled-jsx') {
        styleSolutionSpecificAppFiles = '../files/style-styled-module';
    }
    else if (options.style === 'styled-jsx') {
        styleSolutionSpecificAppFiles = '../files/style-styled-jsx';
    }
    else if (options.style === 'none') {
        styleSolutionSpecificAppFiles = '../files/style-none';
    }
    else if (options.globalCss) {
        styleSolutionSpecificAppFiles = '../files/style-global-css';
    }
    else {
        styleSolutionSpecificAppFiles = '../files/style-css-module';
    }
    const relativePathToRootTsConfig = (0, js_1.getRelativePathToRootTsConfig)(host, options.appProjectRoot);
    const appTests = (0, get_app_tests_1.getAppTests)(options);
    const templateVariables = Object.assign(Object.assign(Object.assign({}, (0, devkit_1.names)(options.name)), options), { tmpl: '', offsetFromRoot: (0, devkit_1.offsetFromRoot)(options.appProjectRoot), appTests, inSourceVitestTests: (0, get_in_source_vitest_tests_template_1.getInSourceVitestTestsTemplate)(appTests) });
    if (options.bundler === 'vite') {
        (0, devkit_1.generateFiles)(host, (0, path_1.join)(__dirname, '../files/base-vite'), options.appProjectRoot, templateVariables);
    }
    else if (options.bundler === 'webpack') {
        (0, devkit_1.generateFiles)(host, (0, path_1.join)(__dirname, '../files/base-webpack'), options.appProjectRoot, templateVariables);
        if (options.compiler === 'babel') {
            (0, devkit_1.writeJson)(host, `${options.appProjectRoot}/.babelrc`, {
                presets: [
                    [
                        '@nx/react/babel',
                        {
                            runtime: 'automatic',
                            importSource: options.style === '@emotion/styled'
                                ? '@emotion/react'
                                : undefined,
                        },
                    ],
                ],
                plugins: [
                    options.style === 'styled-components'
                        ? ['styled-components', { pure: true, ssr: true }]
                        : undefined,
                    options.style === 'styled-jsx' ? 'styled-jsx/babel' : undefined,
                    options.style === '@emotion/styled'
                        ? '@emotion/babel-plugin'
                        : undefined,
                ].filter(Boolean),
            });
        }
        else if (options.style === 'styled-components' ||
            options.style === '@emotion/styled' ||
            options.style === 'styled-jsx') {
            (0, devkit_1.writeJson)(host, `${options.appProjectRoot}/.swcrc`, {
                jsc: {
                    experimental: {
                        plugins: [
                            options.style === 'styled-components'
                                ? [
                                    '@swc/plugin-styled-components',
                                    {
                                        displayName: true,
                                        ssr: true,
                                    },
                                ]
                                : undefined,
                            options.style === 'styled-jsx'
                                ? ['@swc/plugin-styled-jsx', {}]
                                : undefined,
                            options.style === '@emotion/styled'
                                ? ['@swc/plugin-emotion', {}]
                                : undefined,
                        ].filter(Boolean),
                    },
                },
            });
        }
    }
    else if (options.bundler === 'rspack') {
        (0, devkit_1.generateFiles)(host, (0, path_1.join)(__dirname, '../files/base-rspack'), options.appProjectRoot, templateVariables);
    }
    if (options.unitTestRunner === 'none' ||
        (options.unitTestRunner === 'vitest' && options.inSourceTests == true)) {
        host.delete(`${options.appProjectRoot}/src/app/${options.fileName}.spec.tsx`);
    }
    if (!options.minimal) {
        (0, devkit_1.generateFiles)(host, (0, path_1.join)(__dirname, '../files/nx-welcome'), options.appProjectRoot, templateVariables);
    }
    (0, devkit_1.generateFiles)(host, (0, path_1.join)(__dirname, styleSolutionSpecificAppFiles), options.appProjectRoot, templateVariables);
    if (options.js) {
        (0, devkit_1.toJS)(host);
    }
    (0, create_ts_config_1.createTsConfig)(host, options.appProjectRoot, 'app', options, relativePathToRootTsConfig);
}
exports.createApplicationFiles = createApplicationFiles;
