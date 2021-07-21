import { TaskManager, Constants, Logger, PlatformManager } from 'rnv';
import { SDKAndroid, SDKXcode } from '../sdks';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const {
    TVOS,
    ANDROID_TV,
    FIRE_TV,
    TASK_BUILD, TASK_PACKAGE, TASK_EXPORT,
    PARAMS
} = Constants;
const { buildXcodeProject } = SDKXcode;
const { buildAndroid } = SDKAndroid;
const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvBuild = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild');
    const { platform } = c;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    if (shouldSkipTask(c, TASK_BUILD, originTask)) return true;

    switch (platform) {
        case ANDROID_TV:
        case FIRE_TV:
            return buildAndroid(c);
        case TVOS:
            if (parentTask === TASK_EXPORT) {
                // build task is not necessary when exporting ios
                return true;
            }
            return buildXcodeProject(c, platform);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: TASK_BUILD,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [TVOS, ANDROID_TV, FIRE_TV],
};
