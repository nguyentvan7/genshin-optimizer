"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRollupBuildTarget = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nx/devkit");
const maybe_js_1 = require("./maybe-js");
const versions_1 = require("../../../utils/versions");
function addRollupBuildTarget(host, options) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { rollupInitGenerator } = (0, devkit_1.ensurePackage)('@nx/rollup', versions_1.nxVersion);
        // These are used in `@nx/react/plugins/bundle-rollup`
        (0, devkit_1.addDependenciesToPackageJson)(host, {}, {
            '@rollup/plugin-url': versions_1.rollupPluginUrlVersion,
            '@svgr/rollup': versions_1.svgrRollupVersion,
        });
        const { targets } = (0, devkit_1.readProjectConfiguration)(host, options.name);
        const { libsDir } = (0, devkit_1.getWorkspaceLayout)(host);
        const external = ['react', 'react-dom'];
        if (options.style === '@emotion/styled') {
            external.push('@emotion/react/jsx-runtime');
        }
        else {
            external.push('react/jsx-runtime');
        }
        targets.build = {
            executor: '@nx/rollup:rollup',
            outputs: ['{options.outputPath}'],
            options: {
                outputPath: libsDir !== '.'
                    ? `dist/${libsDir}/${options.projectDirectory}`
                    : `dist/${options.projectDirectory}`,
                tsConfig: `${options.projectRoot}/tsconfig.lib.json`,
                project: `${options.projectRoot}/package.json`,
                entryFile: (0, maybe_js_1.maybeJs)(options, `${options.projectRoot}/src/index.ts`),
                external,
                rollupConfig: `@nx/react/plugins/bundle-rollup`,
                compiler: (_a = options.compiler) !== null && _a !== void 0 ? _a : 'babel',
                assets: [
                    {
                        glob: `${options.projectRoot}/README.md`,
                        input: '.',
                        output: '.',
                    },
                ],
            },
        };
        (0, devkit_1.updateProjectConfiguration)(host, options.name, {
            root: options.projectRoot,
            sourceRoot: (0, devkit_1.joinPathFragments)(options.projectRoot, 'src'),
            projectType: 'library',
            tags: options.parsedTags,
            targets,
        });
        return rollupInitGenerator(host, Object.assign(Object.assign({}, options), { skipFormat: true }));
    });
}
exports.addRollupBuildTarget = addRollupBuildTarget;
