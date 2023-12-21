import type { Configuration } from 'webpack';
import type { WithWebOptions } from '@nx/webpack';
import type { NxWebpackExecutionContext } from '@nx/webpack';
interface WithReactOptions extends WithWebOptions {
    svgr?: false;
}
/**
 * @param {WithReactOptions} pluginOptions
 * @returns {NxWebpackPlugin}
 */
export declare function withReact(pluginOptions?: WithReactOptions): (config: Configuration, context: NxWebpackExecutionContext) => Configuration;
export {};
