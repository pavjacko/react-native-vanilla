import { TaskManager, Constants, Logger, PlatformManager } from 'rnv';
import { SDKAndroid, SDKXcode } from '../sdks';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const {
    TVOS,
    ANDROID_TV,
    FIRE_TV,
    TASK_PACKAGE,
    TASK_CONFIGURE,
    PARAMS
} = Constants;
const { packageBundleForXcode } = SDKXcode;
const { packageAndroid } = SDKAndroid;
const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvPackage = async (c, parentTask, originTask) => {
    logTask('taskRnvPackage', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_PACKAGE, originTask);

    if (shouldSkipTask(c, TASK_PACKAGE, originTask)) return true;

    switch (platform) {
        case ANDROID_TV:
        case FIRE_TV:
            return packageAndroid(c);
        case TVOS:
            return packageBundleForXcode(c);
        default:
            logErrorPlatform(c);
            return false;
    }
};

export default {
    description: 'Package source files into bundle',
    fn: taskRnvPackage,
    task: 'package',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [TVOS, ANDROID_TV, FIRE_TV],
};
