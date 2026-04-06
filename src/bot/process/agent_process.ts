import { ChildProcess, spawn } from 'child_process';
import type { AgentInitArgs } from './init_agent.ts';
import { BotSettings } from '../bot.ts';
import { appSettings } from '../../../index.ts';
// import { logoutAgent } from '../mindcraft/mindserver.js';

export class AgentProcess {
    settings: BotSettings;
    id = 0;
    running = false;
    process?: ChildProcess;

    constructor(settings: BotSettings) {
        this.settings = settings;
    }

    start(id = 0, load_memory = false, init_message?: string) {
        this.id = id;
        this.running = true;

        const profile: AgentInitArgs = {
            id,
            settings: this.settings,
            socket_port: appSettings.socket_port,
            load_memory,
            init_message
        }

        const args = ['src/bot/process/init_agent.ts', JSON.stringify(profile)];

        const agentProcess = spawn('node', args, { stdio: 'inherit' });

        let last_restart = Date.now();
        agentProcess.on('exit', (code, signal) => {
            console.log(`Agent process exited with code ${code} and signal ${signal}`);
            this.running = false;
            // logoutAgent(this.name);

            if (code !== null && code > 1) {
                console.log(`Ending task`);
                process.exit(code);
            }

            if (code !== 0 && signal !== 'SIGINT') {
                // agent must run for at least 10 seconds before restarting
                if (Date.now() - last_restart < 10000) {
                    console.error(`Agent process exited too quickly and will not be restarted.`);
                    return;
                }
                console.log('Restarting agent...');
                this.start(id, true, 'Agent process restarted.');
                last_restart = Date.now();
            }
        });

        agentProcess.on('error', (err) => {
            console.error('Agent process error:', err);
        });

        this.process = agentProcess;
    }

    stop() {
        if (!this.running) return;
        this.process?.kill('SIGINT');
    }

    forceRestart() {
        if (this.running && this.process && !this.process.killed) {
            console.log(`Agent process for ${this.settings} is still running. Attempting to force restart.`);

            const restartTimeout = setTimeout(() => {
                console.warn(`Agent ${this.settings} did not stop in time. It might be stuck.`);
            }, 5000); // 5 seconds to exit

            this.process.once('exit', () => {
                clearTimeout(restartTimeout);
                console.log(`Stopped hanging agent ${this.settings}. Now restarting.`);
                this.start(this.id, true, 'Agent process restarted.');
            });
            this.stop(); // sends SIGINT
        } else {
            this.start(this.id, true, 'Agent process restarted.');
        }
    }
}
