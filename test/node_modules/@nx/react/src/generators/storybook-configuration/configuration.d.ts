import { StorybookConfigureSchema } from './schema';
import { Tree } from '@nx/devkit';
export declare function storybookConfigurationGenerator(host: Tree, schema: StorybookConfigureSchema): Promise<import("@nx/devkit").GeneratorCallback>;
export default storybookConfigurationGenerator;
export declare const storybookConfigurationSchematic: (generatorOptions: StorybookConfigureSchema) => (tree: any, context: any) => Promise<any>;
