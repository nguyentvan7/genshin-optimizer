import { Tree } from '@nx/devkit';
import { type FoundTarget } from '@nx/cypress/src/utils/find-target-options';
export declare function addCTTargetWithBuildTarget(tree: Tree, options: {
    project: string;
    buildTarget: string;
    validExecutorNames: Set<string>;
}): Promise<FoundTarget>;
export declare function getBundlerFromTarget(found: FoundTarget, tree: Tree): Promise<'vite' | 'webpack'>;
export declare function isComponent(tree: Tree, filePath: string): boolean;
