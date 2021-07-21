import { Common, Constants, Logger, PlatformManager, TaskManager } from 'rnv';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '../commonEngine';
import { SDKAndroid, SDKXcode } from '../sdks';

const { runAndroid } = SDKAndroid;

const {
    TVOS,
    TASK_RUN,
    ANDROID_TV,
    FIRE_TV,
    TASK_CONFIGURE,
    PARAMS
} = Constants;

const { getConfigProp } = Common;
const { logTask, logSummary, logRaw } = Logger;
const { logErrorPlatform } = PlatformManager;
const { executeOrSkipTask, shouldSkipTask } = TaskManager;
const { runXcodeProject } = SDKXcode;

export const taskRnvRun = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    if (shouldSkipTask(c, TASK_RUN, originTask)) return true;

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);

    switch (platform) {
        case ANDROID_TV:
        case FIRE_TV:
            if (!c.program.only) {
                await startBundlerIfRequired(c, TASK_RUN, originTask);
                await runAndroid(c, target);
                if (!bundleAssets) {
                    logSummary('BUNDLER STARTED');
                }
                return waitForBundlerIfRequired(c);
            }
            return runAndroid(c, target);
        case TVOS:
            if (!c.program.only) {
                await startBundlerIfRequired(c, TASK_RUN, originTask);
                await runXcodeProject(c);
                if (!bundleAssets) {
                    logSummary('BUNDLER STARTED');
                }
                return waitForBundlerIfRequired(c);
            }
            return runXcodeProject(c);
        default:
            return logErrorPlatform(c);
    }
};

export const taskRnvRunHelp = async () => {
    logRaw(`
More info at: https://renative.org/docs/api-cli
`);
};

const Task = {
    description: 'Run your app on target device or emulator',
    fn: taskRnvRun,
    fnHelp: taskRnvRunHelp,
    task: TASK_RUN,
    dependencies: {
        before: TASK_CONFIGURE
    },
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: [TVOS, ANDROID_TV, FIRE_TV],
};

export default Task;
