import { AgentProcess } from "./process/agent_process.ts";
import { getServer, type MCServerSettings } from "../mcserver/mcserver.ts";
import { socketServer } from "../../index.ts";

export interface BotSettings {
    profile: BotProfile,
    server: MCServerSettings,
}

export interface BotProfile {
    username: string
    auth: 'mojang' | 'microsoft' | 'offline',
}

class BotManager {
    private processes: Map<number, AgentProcess> = new Map();

    constructor() { }

    async createAgent(id: number, settings: BotSettings, load_memory?: boolean, init_message?: string) {
        const username = settings.profile.username;

        try {
            await getServer(settings.server).then(server => {
                settings.server = server;
            }).catch(err => {
                console.warn(`Error getting server: ${err}`);
                console.warn('Attempting to connect anyway...');
            })

            const agentProcess = new AgentProcess(id, settings);
            agentProcess.start(load_memory, init_message);
            this.processes.set(id, agentProcess);
        } catch (error) {
            console.error(`Error creating agent ${username}:`, error);
            this.destroyAgent(id);
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

    listAgents() {
        return Array.from(this.processes.entries()).map(([id, process]) => ({
            id,
            username: process.settings.profile.username,
        }));
    }

    destroyAgent(id: number) {
        this.processes.get(id)?.stop();
    }
}

export const botManager = new BotManager();
