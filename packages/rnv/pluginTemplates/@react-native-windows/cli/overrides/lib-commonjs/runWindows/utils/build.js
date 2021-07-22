"use strict";
/**
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 * @format
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMsBuildProps = exports.getAppProjectFile = exports.getAppSolutionFile = exports.buildSolution = void 0;
const path = require("path");
const msbuildtools_1 = require("./msbuildtools");
const version_1 = require("./version");
const commandWithProgress_1 = require("./commandWithProgress");
async function buildSolution(buildTools, slnFile, buildType, buildArch, msBuildProps, verbose, target, buildLogDirectory, singleproc, additionalMetroOptions) {
    const minVersion = new version_1.default(10, 0, 18362, 0);
    const allVersions = msbuildtools_1.default.getAllAvailableUAPVersions();
    if (!allVersions.some(v => v.gte(minVersion))) {
        throw new Error('Must have a minimum Windows SDK version 10.0.18362.0 installed');
    }
    await buildTools.buildProject(slnFile, buildType, buildArch, msBuildProps, verbose, target, buildLogDirectory, singleproc, additionalMetroOptions);
}
exports.buildSolution = buildSolution;
const configErrorString = 'Error: ';
function getAppSolutionFile(options, config) {
    // Use the solution file if specified
    if (options.sln) {
        return path.join(options.root, options.sln);
    }
    // Check the answer from react-native config
    const windowsAppConfig = config.project.windows;
    if (!windowsAppConfig) {
        throw new Error("Couldn't determine Windows app config");
    }
    const configSolutionFile = windowsAppConfig.solutionFile;
    if (configSolutionFile.startsWith(configErrorString)) {
        commandWithProgress_1.newError(configSolutionFile.substr(configErrorString.length) +
            ' Optionally, use --sln {slnFile}.');
        return null;
    }
    else {
        return path.join(windowsAppConfig.folder, windowsAppConfig.sourceDir, configSolutionFile);
    }
}
exports.getAppSolutionFile = getAppSolutionFile;
function getAppProjectFile(options, config) {
    // Use the project file if specified
    if (options.proj) {
        return path.join(options.root, options.proj);
    }
    // Check the answer from react-native config
    const windowsAppConfig = config.project.windows;
    const configProject = windowsAppConfig.project;
    if (typeof configProject === 'string' &&
        configProject.startsWith(configErrorString)) {
        commandWithProgress_1.newError(configProject.substr(configErrorString.length) +
            ' Optionally, use --proj {projFile}.');
        return null;
    }
    else {
        const configProjectFile = configProject.projectFile;
        if (configProjectFile.startsWith(configErrorString)) {
            commandWithProgress_1.newError(configProjectFile.substr(configErrorString.length) +
                ' Optionally, use --proj {projFile}.');
            return null;
        }
        return path.join(windowsAppConfig.folder, windowsAppConfig.sourceDir, configProjectFile);
    }
}
exports.getAppProjectFile = getAppProjectFile;
function parseMsBuildProps(options) {
    const result = {};
    if (options.msbuildprops) {
        const props = options.msbuildprops.split(',');
        for (const prop of props) {
            const propAssignment = prop.split('=');
            result[propAssignment[0]] = propAssignment[1];
        }
    }
    return result;
}
exports.parseMsBuildProps = parseMsBuildProps;
//# sourceMappingURL=build.js.map