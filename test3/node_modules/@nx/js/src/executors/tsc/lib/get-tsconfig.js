"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessedTaskTsConfigs = void 0;
const devkit_1 = require("@nx/devkit");
const fileutils_1 = require("nx/src/utils/fileutils");
const path_1 = require("path");
const buildable_libs_utils_1 = require("../../../utils/buildable-libs-utils");
const get_task_options_1 = require("./get-task-options");
function getProcessedTaskTsConfigs(tasks, tasksOptions, context) {
    const taskInMemoryTsConfigMap = {};
    for (const task of tasks) {
        generateTaskTsConfigOrGetDependentBuildableProjectNode(task, tasksOptions, context, taskInMemoryTsConfigMap);
    }
    return taskInMemoryTsConfigMap;
}
exports.getProcessedTaskTsConfigs = getProcessedTaskTsConfigs;
const taskTsConfigGenerationCache = new Map();
function generateTaskTsConfigOrGetDependentBuildableProjectNode(task, tasksOptions, context, taskInMemoryTsConfigMap) {
    var _a, _b, _c;
    if (taskTsConfigGenerationCache.has(task)) {
        return taskTsConfigGenerationCache.get(task);
    }
    let tsConfig = (_b = (_a = tasksOptions[task]) === null || _a === void 0 ? void 0 : _a.tsConfig) !== null && _b !== void 0 ? _b : (0, get_task_options_1.getTaskOptions)(task, context).tsConfig;
    let taskWithTsConfig = task;
    if (!tsConfig) {
        // check if other tasks in the task graph from the same project has a tsConfig
        const otherTasksInProject = getDependencyTasksInSameProject(task, context);
        const taskTsConfig = findTaskWithTsConfig(otherTasksInProject, context);
        if (taskTsConfig) {
            if (taskTsConfigGenerationCache.has(taskTsConfig.tsConfig)) {
                return taskTsConfigGenerationCache.get(taskTsConfig.tsConfig);
            }
            tsConfig = taskTsConfig.tsConfig;
            taskWithTsConfig = taskTsConfig.task;
        }
    }
    if (tsConfig) {
        const { projectReferences, dependentBuildableProjectNodes } = collectDependenciesFromTask(task, tasksOptions, context, taskInMemoryTsConfigMap);
        taskInMemoryTsConfigMap[taskWithTsConfig] = getInMemoryTsConfig(tsConfig, (_c = tasksOptions[taskWithTsConfig]) !== null && _c !== void 0 ? _c : (0, get_task_options_1.getTaskOptions)(taskWithTsConfig, context), projectReferences, dependentBuildableProjectNodes);
        const result = { tsConfig };
        taskTsConfigGenerationCache.set(task, result);
        return result;
    }
    // there's no tsConfig, return a buildable project node so the path mapping
    // is remapped to the output
    const result = taskToDependentBuildableProjectNode(task, context);
    taskTsConfigGenerationCache.set(task, result);
    return result;
}
const projectDependenciesCache = new Map();
function collectDependenciesFromTask(task, tasksOptions, context, taskInMemoryTsConfigMap) {
    var _a;
    const { project: taskProject } = (0, devkit_1.parseTargetString)(task, context.projectGraph);
    if (projectDependenciesCache.has(taskProject)) {
        return projectDependenciesCache.get(taskProject);
    }
    const dependentBuildableProjectNodes = [];
    const projectReferences = new Set();
    const allProjectTasks = [
        task,
        ...getDependencyTasksInSameProject(task, context),
    ];
    for (const projectTask of allProjectTasks) {
        for (const depTask of (_a = context.taskGraph.dependencies[projectTask]) !== null && _a !== void 0 ? _a : []) {
            if (task === depTask) {
                continue;
            }
            const { project: depTaskProject } = (0, devkit_1.parseTargetString)(depTask, context.projectGraph);
            if (depTaskProject === taskProject) {
                // recursively collect dependencies for tasks in the same project
                const result = collectDependenciesFromTask(depTask, tasksOptions, context, taskInMemoryTsConfigMap);
                result.projectReferences.forEach((pr) => {
                    projectReferences.add(pr);
                });
                result.dependentBuildableProjectNodes.forEach((node) => {
                    dependentBuildableProjectNodes.push(node);
                });
            }
            else {
                // task is from a different project, get its project reference or buildable node
                const result = generateTaskTsConfigOrGetDependentBuildableProjectNode(depTask, tasksOptions, context, taskInMemoryTsConfigMap);
                if ('tsConfig' in result) {
                    projectReferences.add(result.tsConfig);
                }
                else {
                    dependentBuildableProjectNodes.push(result);
                }
            }
        }
    }
    projectDependenciesCache.set(taskProject, {
        projectReferences: Array.from(projectReferences),
        dependentBuildableProjectNodes,
    });
    return projectDependenciesCache.get(taskProject);
}
function taskToDependentBuildableProjectNode(task, context) {
    const target = context.taskGraph.tasks[task].target;
    const projectGraphNode = context.projectGraph.nodes[target.project];
    const libPackageJsonPath = (0, path_1.join)(context.root, projectGraphNode.data.root, 'package.json');
    return {
        name: (0, fileutils_1.fileExists)(libPackageJsonPath)
            ? (0, devkit_1.readJsonFile)(libPackageJsonPath).name
            : target.project,
        outputs: (0, devkit_1.getOutputsForTargetAndConfiguration)({ overrides: {}, target }, projectGraphNode),
        node: projectGraphNode,
    };
}
function getInMemoryTsConfig(tsConfig, taskOptions, projectReferences, dependentBuildableProjectNodes) {
    var _a, _b;
    const originalTsConfig = (0, devkit_1.readJsonFile)(tsConfig, {
        allowTrailingComma: true,
        disallowComments: false,
    });
    const allProjectReferences = Array.from(new Set(((_a = originalTsConfig.references) !== null && _a !== void 0 ? _a : [])
        .map((r) => r.path)
        .concat(projectReferences)));
    return {
        content: JSON.stringify(Object.assign(Object.assign({}, originalTsConfig), { compilerOptions: Object.assign(Object.assign({}, originalTsConfig.compilerOptions), { rootDir: taskOptions.rootDir, outDir: taskOptions.outputPath, composite: true, declaration: true, declarationMap: true, tsBuildInfoFile: (0, path_1.join)(taskOptions.outputPath, 'tsconfig.tsbuildinfo'), paths: dependentBuildableProjectNodes.length
                    ? (0, buildable_libs_utils_1.computeCompilerOptionsPaths)(tsConfig, dependentBuildableProjectNodes)
                    : (_b = originalTsConfig.compilerOptions) === null || _b === void 0 ? void 0 : _b.paths }), references: allProjectReferences.map((pr) => ({ path: pr })) })),
        path: tsConfig.replace(/\\/g, '/'),
    };
}
function findTaskWithTsConfig(tasks, context) {
    for (const task of tasks) {
        const depTaskOptions = (0, get_task_options_1.getTaskOptions)(task, context);
        if (depTaskOptions === null || depTaskOptions === void 0 ? void 0 : depTaskOptions.tsConfig) {
            return { task: task, tsConfig: depTaskOptions.tsConfig };
        }
    }
    return null;
}
function getDependencyTasksInSameProject(task, context) {
    const { project: taskProject } = (0, devkit_1.parseTargetString)(task, context.projectGraph);
    return Object.keys(context.taskGraph.tasks).filter((t) => t !== task &&
        (0, devkit_1.parseTargetString)(t, context.projectGraph).project === taskProject);
}
