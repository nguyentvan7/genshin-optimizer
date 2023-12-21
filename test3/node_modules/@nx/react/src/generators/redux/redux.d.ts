import { Schema } from './schema';
import { Tree } from '@nx/devkit';
export declare function reduxGenerator(host: Tree, schema: Schema): Promise<import("@nx/devkit").GeneratorCallback>;
export default reduxGenerator;
export declare const reduxSchematic: (generatorOptions: Schema) => (tree: any, context: any) => Promise<any>;
