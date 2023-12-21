import { ExecutorContext } from '@nx/devkit';
import { WebDevServerOptions } from '@nx/webpack/src/executors/dev-server/schema';
type ModuleFederationDevServerOptions = WebDevServerOptions & {
    devRemotes?: string | string[];
    skipRemotes?: string[];
};
export default function moduleFederationDevServer(options: ModuleFederationDevServerOptions, context: ExecutorContext): AsyncIterableIterator<{
    success: boolean;
    baseUrl?: string;
}>;
export {};
