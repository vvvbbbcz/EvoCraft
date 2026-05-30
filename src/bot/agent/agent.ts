import { initMineflayerBot } from './mineflayer_bot.ts';
import type { BotSettings } from '../bot.ts';
import type { Bot } from 'mineflayer';
import type { AgentInitArgs } from '../process/init_agent.ts';
import { io, Socket } from 'socket.io-client';

export class Agent {
    id: number;
    settings: BotSettings;
    socket: Socket;
    bot?: Bot;
    spawned = false;
    interrupt = false;
    shut_up = false;

    constructor(args: AgentInitArgs) {
        console.log(`Initializing agent ${args.settings.profile.username}...`);

        this.id = args.id;
        this.settings = args.settings;
        this.socket = io(`http://localhost:${args.socket_port}/bot`, {
            autoConnect: false,
            auth: {
                id: this.id,
                profile: this.settings.profile
            }
        });
    }

    async start(load_memory = false, init_message: string | null = null) {
        await this.connectSocket()

        const name = this.settings.profile.username;

        console.log(name, 'logging into minecraft...');
        this.bot = initMineflayerBot(this.settings);

        this.bot.on('login', () => {
            console.log(name, 'logged in!');
            this.socket.emit('botLogin', this.id);
        });

        const spawnTimeout = setTimeout(() => {
            console.error('Bot has not spawned after 30 seconds. Exiting.');
            process.exit(0);
        }, 30000);
        this.bot.once('spawn', async () => {
            clearTimeout(spawnTimeout);
            console.log(`${name} spawned.`);

            this.spawned = true;
            this.socket.emit('botStatus', this.id, { spawned: true });
        });
    }

    private async connectSocket() {
        if (this.socket.connected) return;

        this.socket.connect();

        await new Promise((resolve, reject) => {
            this.socket?.on('connect', () => resolve(undefined));
            this.socket?.on('connect_error', (err) => {
                console.error('Connection failed:', err);
                reject(err);
            });
        });

        console.log(this.settings.profile.username, 'connected to SocketServer');

        this.socket.on('disconnect', () => {
            console.log('Disconnected from SocketServer');
            this.killAll('Disconnected from SocketServer. Killing agent process.');
        });

        this.socket.on('getStatus', () => {
            this.socket.emit('botStatus', this.id, {
                username: this.settings.profile.username,
                online: true,
                spawned: this.spawned
            })
        });

        this.socket.on('restartAgent', (agentName: string) => {
            console.log(`Restarting agent: ${agentName}`);
            this.killAll();
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
        this.socket.emit('botShutdown', this.id);
    }

    killAll(msg = 'Killing agent process...', code = 0) {
        process.exit(code);
    }
}
