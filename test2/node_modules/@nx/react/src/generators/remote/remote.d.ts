import { GeneratorCallback, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../application/schema';
import { Schema } from './schema';
export declare function addModuleFederationFiles(host: Tree, options: NormalizedSchema): void;
export declare function remoteGenerator(host: Tree, schema: Schema): Promise<GeneratorCallback>;
export default remoteGenerator;
