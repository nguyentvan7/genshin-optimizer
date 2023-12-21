"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskWithTscExecutorOptions = exports.getTaskOptions = void 0;
const devkit_1 = require("@nx/devkit");
const path_1 = require("path");
const normalize_options_1 = require("./normalize-options");
function getTaskOptions(taskName, context) {
    const result = getTaskWithTscExecutorOptions(taskName, context);
    if (result) {
        return result;
    }
    const { taskOptions, root, projectNode, target } = parseTaskInfo(taskName, context);
    const outputs = (0, devkit_1.getOutputsForTargetAndConfiguration)({ overrides: context.taskGraph.tasks[taskName].overrides, target }, projectNode);
    const outputPath = outputs.length
        ? (0, path_1.join)(context.root, outputs[0])
        : (0, path_1.join)(context.root, 'dist', root);
    const rootDir = (0, path_1.join)(context.root, root);
    const tsConfig = taskOptions.tsConfig
        ? (0, path_1.join)(context.root, taskOptions.tsConfig)
        : null;
    return { tsConfig, rootDir, outputPath };
}
exports.getTaskOptions = getTaskOptions;
const tasksOptionsCache = new Map();
function getTaskWithTscExecutorOptions(taskName, context) {
    if (tasksOptionsCache.has(taskName)) {
        return tasksOptionsCache.get(taskName);
    }
    try {
        const { taskOptions, sourceRoot, root } = parseTaskInfo(taskName, context);
        const normalizedTaskOptions = (0, normalize_options_1.normalizeOptions)(taskOptions, context.root, sourceRoot, root);
        tasksOptionsCache.set(taskName, normalizedTaskOptions);
        return normalizedTaskOptions;
    }
    catch (_a) {
        tasksOptionsCache.set(taskName, null);
        return null;
    }
}
exports.getTaskWithTscExecutorOptions = getTaskWithTscExecutorOptions;
function parseTaskInfo(taskName, context) {
    var _a, _b;
    const target = context.taskGraph.tasks[taskName].target;
    const projectNode = context.projectGraph.nodes[target.project];
    const targetConfig = (_a = projectNode.data.targets) === null || _a === void 0 ? void 0 : _a[target.target];
    const { sourceRoot, root } = projectNode.data;
    const taskOptions = Object.assign(Object.assign({}, targetConfig.options), (target.configuration
        ? (_b = targetConfig.configurations) === null || _b === void 0 ? void 0 : _b[target.configuration]
        : {}));
    return { taskOptions, root, sourceRoot, projectNode, target };
}
