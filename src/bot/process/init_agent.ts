// import { Agent } from '../agent/agent.js';
// import { serverProxy } from '../mindserver_proxy.js';

export interface AgentInitArgs {
    name: string;
    port: number;
    id: number;
    load_memory: boolean;
    init_message: string | null;
}

const args = process.argv[2];
if (args === undefined || args.length < 1) {
    console.log('Usage: node init_agent.js {\"name\":\"\", \"port\":0, \"id\":0, ' +
        '\"load_memory\":false, \"init_message\":\"\"}');
    process.exit(1);
}

const argv: AgentInitArgs = JSON.parse(args);

// (async () => {
//     try {
//         console.log('Connecting to MindServer');
//         await serverProxy.connect(argv.name, argv.port);
//         console.log('Starting agent');
//         const agent = new Agent();
//         serverProxy.setAgent(agent);
//         await agent.start(argv.load_memory, argv.init_message, argv.id);
//     } catch (error) {
//         console.error(`Failed to start agent process: ${error}`);
//         process.exit(1);
//     }
// })();
