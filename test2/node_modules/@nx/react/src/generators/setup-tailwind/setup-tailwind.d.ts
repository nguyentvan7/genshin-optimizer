import type { GeneratorCallback, Tree } from '@nx/devkit';
import type { SetupTailwindOptions } from './schema';
export declare function setupTailwindGenerator(tree: Tree, options: SetupTailwindOptions): Promise<GeneratorCallback>;
export default setupTailwindGenerator;
export declare const setupTailwindSchematic: (generatorOptions: SetupTailwindOptions) => (tree: any, context: any) => Promise<any>;
