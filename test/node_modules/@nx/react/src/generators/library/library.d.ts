import { GeneratorCallback, Tree } from '@nx/devkit';
import { Schema } from './schema';
export declare function libraryGenerator(host: Tree, schema: Schema): Promise<GeneratorCallback>;
export default libraryGenerator;
export declare const librarySchematic: (generatorOptions: Schema) => (tree: any, context: any) => Promise<any>;
