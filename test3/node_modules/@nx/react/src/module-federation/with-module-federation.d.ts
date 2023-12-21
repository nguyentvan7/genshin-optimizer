import { ModuleFederationConfig } from '@nx/devkit/src/utils/module-federation';
import type { AsyncNxWebpackPlugin } from '@nx/webpack';
/**
 * @param {ModuleFederationConfig} options
 * @return {Promise<AsyncNxWebpackPlugin>}
 */
export declare function withModuleFederation(options: ModuleFederationConfig): Promise<AsyncNxWebpackPlugin>;
