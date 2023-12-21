import type { ExecutorContext } from '@nx/devkit';
import type { NormalizedExecutorOptions } from '../../../utils/schema';
export declare function getTaskOptions(taskName: string, context: ExecutorContext): NormalizedExecutorOptions | {
    tsConfig: string | null;
    rootDir: string;
    outputPath: string;
};
export declare function getTaskWithTscExecutorOptions(taskName: string, context: ExecutorContext): NormalizedExecutorOptions | null;
