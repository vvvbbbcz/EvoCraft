import { ChildProcess, spawn } from 'child_process';
import { AgentInitArgs } from './init_agent.ts';
// import { logoutAgent } from '../mindcraft/mindserver.js';

export class AgentProcess {
    name: string;
    port: number;
    id = 0;
    running = false;
    process?: ChildProcess;

    constructor(name: string, port: number) {
        this.name = name;
        this.port = port;
    }

    start(load_memory = false, init_message: string | null = null, id = 0) {
        this.id = id;
        this.running = true;

        const profile: AgentInitArgs = {
            name: this.name,
            port: this.port,
            id: this.id,
            load_memory: load_memory,
            init_message: init_message
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
                this.start(true, 'Agent process restarted.', id);
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
            console.log(`Agent process for ${this.name} is still running. Attempting to force restart.`);

            const restartTimeout = setTimeout(() => {
                console.warn(`Agent ${this.name} did not stop in time. It might be stuck.`);
            }, 5000); // 5 seconds to exit

            this.process.once('exit', () => {
                clearTimeout(restartTimeout);
                console.log(`Stopped hanging agent ${this.name}. Now restarting.`);
                this.start(true, 'Agent process restarted.', this.id);
            });
            this.stop(); // sends SIGINT
        } else {
            this.start(true, 'Agent process restarted.', this.id);
        }
    }
}
