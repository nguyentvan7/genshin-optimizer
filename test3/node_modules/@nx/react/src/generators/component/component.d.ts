import { GeneratorCallback, Tree } from '@nx/devkit';
import { Schema } from './schema';
export declare function componentGenerator(host: Tree, schema: Schema): Promise<GeneratorCallback>;
export default componentGenerator;
export declare const componentSchematic: (generatorOptions: Schema) => (tree: any, context: any) => Promise<any>;
