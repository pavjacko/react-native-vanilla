import chalk from 'chalk';
import path from 'path';
import shell from 'shelljs';
import Common, { initializeBuilder, logComplete, logError } from './common';
import Runner from './cli/runner';
import App from './cli/app';
import Platform from './cli/platform';
import Hooks from './cli/hooks';
import Target from './cli/target';
import Linker from './cli/linker';
import Plugin from './cli/plugin';
import Constants from './constants';
import Exec from './exec';
import FileUtils from './fileutils';

const commands = {
    start: Runner,
    build: Runner,
    export: Runner,
    app: App,
    link: Linker,
    platform: Platform,
    run: Runner,
    package: Runner,
    deploy: Runner,
    target: Target,
    plugin: Plugin,
    log: Runner,
    hooks: Hooks,
};

const run = (cmd, subCmd, program, process) => {
    initializeBuilder(cmd, subCmd, process, program)
        .then((v) => {
            if (commands[cmd]) {
                commands[cmd](v).then(() => logComplete(true)).catch(e => logError(e, true));
            } else if (program.help) {
                let cmdsString = '';
                for (const key in commands) {
                    cmdsString += `rnv ${key}\n`;
                }
                console.log(`
${chalk.bold.white('COMMANDS:')}

${cmdsString}

${chalk.bold.white('OPTIONS:')}

'-i, --info', 'Show full debug info'
'-u, --update', 'Force update dependencies (iOS only)'
'-p, --platform <value>', 'Select specific platform' // <ios|android|web|...>
'-c, --appConfigID <value>', 'Select specific appConfigID' // <ios|android|web|...>
'-t, --target <value>', 'Select specific simulator' // <.....>
'-d, --device [value]', 'Select connected device'
'-s, --scheme <value>', 'Select build scheme' // <Debug | Release>
'-f, --filter <value>', 'Filter Value'
'-l, --list', 'Return list of items related to command' // <alpha|beta|prod>
'-r, --reset', 'Also perform reset'
'-b, --blueprint', 'Blueprint for targets'
'-h, --host <value>', 'Custom Host IP'
'-x, --exeMethod <value>', 'Executable method in buildHooks'
'-P, --port <value>', 'Custom Port'
'-H, --help', 'Help'
                `);
                logComplete(true);
            } else {
                logError(`Command ${chalk.white(cmd)} is not supported by ReNativeCLI. run ${chalk.white('rnv')} for help`, true);
            }
        }).catch(e => logError(e, true));
};


export { Constants, Runner, App, Platform, Target, Common, Exec, FileUtils };


export default { run };
