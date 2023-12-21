"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProject = void 0;
const devkit_1 = require("@nx/devkit");
function updateProject(tree, config, options) {
    var _a, _b, _c, _d, _e;
    var _f;
    if (((_b = (_a = config === null || config === void 0 ? void 0 : config.targets) === null || _a === void 0 ? void 0 : _a.build) === null || _b === void 0 ? void 0 : _b.executor) === '@nx/webpack:webpack' ||
        ((_d = (_c = config === null || config === void 0 ? void 0 : config.targets) === null || _c === void 0 ? void 0 : _c.build) === null || _d === void 0 ? void 0 : _d.executor) === '@nrwl/webpack:webpack') {
        (_e = (_f = config.targets.build).options) !== null && _e !== void 0 ? _e : (_f.options = {});
        config.targets.build.options.postcssConfig = (0, devkit_1.joinPathFragments)(config.root, 'postcss.config.js');
        (0, devkit_1.updateProjectConfiguration)(tree, options.project, config);
    }
}
exports.updateProject = updateProject;
