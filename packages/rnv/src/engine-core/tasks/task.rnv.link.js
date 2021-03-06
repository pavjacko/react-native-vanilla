import path from 'path';
import { logInfo, logTask, logSuccess } from '../../core/systemManager/logger';
import { PARAMS, RNV_PACKAGES } from '../../core/constants';
import {
    fsExistsSync, fsRenameSync, fsSymlinkSync
} from '../../core/systemManager/fileutils';

const _linkPackage = (c, key, folder) => {
    const rnvPath = path.join(c.paths.project.nodeModulesDir, key);
    const rnvPathUnlinked = path.join(c.paths.project.nodeModulesDir, `${key}_unlinked`);
    const pkgDir = path.join(c.paths.rnv.dir, '../', folder);

    if (fsExistsSync(rnvPathUnlinked)) {
        logInfo(`${key} is already linked. SKIPPING`);
    } else if (fsExistsSync(rnvPath)) {
        fsRenameSync(rnvPath, rnvPathUnlinked);
        fsSymlinkSync(pkgDir, rnvPath);
        logSuccess(`${key} => link => SUCCESS`);
    }
};

export const taskRnvLink = async (c) => {
    logTask('taskRnvLink');

    RNV_PACKAGES.forEach((pkg) => {
        if (!pkg.skipLinking) {
            _linkPackage(c, pkg.packageName, pkg.folderName);
        }
    });

    return true;
};

export default {
    description: '',
    fn: taskRnvLink,
    task: 'link',
    params: PARAMS.withBase(),
    platforms: [],
    skipPlatforms: true,
    isGlobalScope: true
};
