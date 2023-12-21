import { GeneratorCallback, Tree } from '@nx/devkit';
export declare function updateModuleFederationProject(host: Tree, options: {
    projectName: string;
    appProjectRoot: string;
    devServerPort?: number;
}): GeneratorCallback;
