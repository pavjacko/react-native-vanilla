import { TaskManager, Constants, Logger, PlatformManager } from 'rnv';
import { SDKXcode } from '../sdks';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const {
    TVOS,
    ANDROID_TV,
    FIRE_TV,
    TASK_BUILD,
    TASK_EXPORT,
    PARAMS
} = Constants;
const { exportXcodeProject } = SDKXcode;
const { executeOrSkipTask, shouldSkipTask } = TaskManager;


export const taskRnvExport = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    if (shouldSkipTask(c, TASK_EXPORT, originTask)) return true;

    switch (platform) {
        case ANDROID_TV:
        case FIRE_TV:
            // Android Platforms don't need extra export step
            return true;
        case TVOS:
            return exportXcodeProject(c, platform);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: TASK_EXPORT,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [TVOS, ANDROID_TV, FIRE_TV],
};
