import { AgentProcess } from "./process/agent_process.ts";
import { getServer, type MCServerSettings } from "../mcserver/mcserver.ts";

export interface BotSettings {
    profile: BotProfile,
    server: MCServerSettings,
}

export interface BotProfile {
    username: string
    auth: 'mojang' | 'microsoft' | 'offline',
}

class BotManager {
    private agent_count = 0;
    private processes: { [username: string]: AgentProcess } = {};

    constructor() { }

    async createAgent(settings: BotSettings, load_memory?: boolean, init_message?: string) {
        const username = settings.profile.username;
        const agentIndex = ++this.agent_count;

        try {
            await getServer(settings.server).then(server => {
                settings.server = server;
            }).catch(err => {
                console.warn(`Error getting server: ${err}`);
                console.warn('Attempting to connect anyway...');
            })

            const agentProcess = new AgentProcess(agentIndex, settings);
            agentProcess.start(load_memory, init_message);
            this.processes[settings.profile.username] = agentProcess;
        } catch (error) {
            console.error(`Error creating agent ${username}:`, error);
            this.destroyAgent(username);
            return {
                success: false,
                error
            };
        }
        return {
            success: true,
            error: null
        };
    }

    destroyAgent(name: string) {
        if (this.processes[name]) {
            this.processes[name].stop();
            delete this.processes[name];
        }
    }
}

export const botManager = new BotManager();
