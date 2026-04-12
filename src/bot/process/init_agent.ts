import { Agent } from '../agent/agent.ts';
import { BotSettings } from '../bot.ts';

export interface AgentInitArgs {
    id: number;
    settings: BotSettings;
    socket_port: number;
    load_memory: boolean;
    init_message?: string;
}

const args = process.argv[2];
if (args === undefined || args.length < 1) {
    console.log('Usage: node init_agent.js <JSON args>');
    process.exit(1);
}

const init_args: AgentInitArgs = JSON.parse(args);

(async () => {
    try {
        console.log('Starting agent');
        const agent = new Agent(init_args);
        await agent.start(init_args.load_memory, init_args.init_message);
    } catch (error) {
        console.error(`Failed to start agent process: ${error}`);
        process.exit(1);
    }
})();
