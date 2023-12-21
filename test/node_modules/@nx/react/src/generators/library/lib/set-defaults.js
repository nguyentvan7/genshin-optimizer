"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaults = void 0;
const devkit_1 = require("@nx/devkit");
function setDefaults(host, options) {
    var _a, _b;
    const nxJson = (0, devkit_1.readNxJson)(host);
    nxJson.generators = nxJson.generators || {};
    nxJson.generators['@nx/react'] = nxJson.generators['@nx/react'] || {};
    const prev = Object.assign({}, nxJson.generators['@nx/react']);
    const libDefaults = Object.assign(Object.assign({}, prev.library), { unitTestRunner: (_b = (_a = prev.library) === null || _a === void 0 ? void 0 : _a.unitTestRunner) !== null && _b !== void 0 ? _b : options.unitTestRunner });
    nxJson.generators = Object.assign(Object.assign({}, nxJson.generators), { '@nx/react': Object.assign(Object.assign({}, prev), { library: libDefaults }) });
    (0, devkit_1.updateNxJson)(host, nxJson);
}
exports.setDefaults = setDefaults;
