"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaults = void 0;
const devkit_1 = require("@nx/devkit");
function setDefaults(host, options) {
    if (options.skipNxJson) {
        return;
    }
    const nxJson = (0, devkit_1.readNxJson)(host);
    if (options.rootProject) {
        nxJson.defaultProject = options.projectName;
    }
    nxJson.generators = nxJson.generators || {};
    nxJson.generators['@nx/react'] = nxJson.generators['@nx/react'] || {};
    const prev = Object.assign({}, nxJson.generators['@nx/react']);
    const appDefaults = Object.assign({ style: options.style, linter: options.linter, bundler: options.bundler }, prev.application);
    const componentDefaults = Object.assign({ style: options.style }, prev.component);
    const libDefaults = Object.assign({ style: options.style, linter: options.linter }, prev.library);
    nxJson.generators = Object.assign(Object.assign({}, nxJson.generators), { '@nx/react': Object.assign(Object.assign({}, prev), { application: appDefaults, component: componentDefaults, library: libDefaults }) });
    (0, devkit_1.updateNxJson)(host, nxJson);
}
exports.setDefaults = setDefaults;
