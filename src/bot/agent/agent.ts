import { initMineflayerBot } from './mineflayer_bot.ts';
import type { BotSettings } from '../bot.ts';
import { SocketProxy } from '../process/socket_proxy.ts';
import type { Bot } from 'mineflayer';
import type { AgentInitArgs } from '../process/init_agent.ts';

export class Agent {
    id: number;
    settings: BotSettings;
    socket_proxy: SocketProxy;
    bot?: Bot;
    interrupt = false;
    shut_up = false;

    constructor(args: AgentInitArgs) {
        console.log(`Initializing agent ${args.settings.profile.username}...`);

        this.id = args.id;
        this.settings = args.settings;
        this.socket_proxy = new SocketProxy(args.socket_port);
    }

    async start(load_memory = false, init_message: string | null = null) {
        const name = this.settings.profile.username;

        console.log(name, 'logging into minecraft...');
        this.bot = initMineflayerBot(this.settings);

        this.bot.on('login', () => {
            console.log(name, 'logged in!');
            this.socket_proxy.login();
        });

        const spawnTimeout = setTimeout(() => {
            console.error('Bot has not spawned after 30 seconds. Exiting.');
            process.exit(0);
        }, 30000);
        this.bot.once('spawn', async () => {
            clearTimeout(spawnTimeout);
            console.log(`${name} spawned.`);
        });
    }

    requestInterrupt() {
        this.interrupt = true;
        this.bot?.stopDigging();
        this.bot?.collectBlock.cancelTask();
        this.bot?.pathfinder.stop();
        this.bot?.pvp.stop();
    }

    shutUp() {
        this.shut_up = true;
    }

    shutdown() {
        this.bot?.quit();
        this.socket_proxy.shutdown();
    }

    killAll(msg = 'Killing agent process...', code = 0) {
        process.exit(code);
    }
}
