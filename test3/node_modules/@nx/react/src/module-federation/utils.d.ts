import { ModuleFederationConfig } from '@nx/devkit/src/utils/module-federation';
export declare function getFunctionDeterminateRemoteUrl(isServer?: boolean): (remote: string) => string;
export declare function getModuleFederationConfig(mfConfig: ModuleFederationConfig, options?: {
    isServer: boolean;
    determineRemoteUrl?: (remote: string) => string;
}): Promise<{
    sharedLibraries: import("@nx/devkit").SharedWorkspaceLibraryConfig;
    sharedDependencies: {
        [x: string]: import("@nx/devkit").SharedLibraryConfig;
    };
    mappedRemotes: Record<string, string>;
}>;
