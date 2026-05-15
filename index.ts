import 'dotenv/config';
import { createWebSocket } from './src/web/server/socketServer.ts';
import sequelize, { Bot } from './src/database/sequelize.ts';
import { botManager } from './src/bot/bot.ts';

interface Settings {
    socket_port: number;
    postgres_url: string;
    mc_server_host: string;
    mc_server_port: number;
    mc_server_version?: string;
}

function parseEnv(): Settings {
    const env = process.env;

    const socket_server_port = parseInt(env.SOCKET_SERVER_PORT ?? "3000");

    return {
        socket_port: isNaN(socket_server_port) ? 3000 : socket_server_port,
        postgres_url: env.POSTGRES_URL ?? "",
        mc_server_host: env.MC_SERVER_HOST ?? "localhost",
        mc_server_port: parseInt(env.MC_SERVER_PORT ?? "25565"),
        mc_server_version: env.MC_SERVER_VERSION ?? "1.20.1"
    }
}

const settings = parseEnv();

sequelize.init();

const server = createWebSocket(settings.socket_port);

try {
    for (const bot of await Bot.findAll()) {
        botManager.createAgent({
            profile: {
                username: bot.username,
                auth: bot.auth as 'mojang' | 'microsoft' | 'offline',
            },
            server: {
                host: settings.mc_server_host,
                port: settings.mc_server_port,
                version: settings.mc_server_version
            }
        }, true)
        console.log(`Loaded bot: ${bot.username}`)
    }
} catch (err) {
    console.error(`Failed to load bots: ${err}`)
}

export { settings as appSettings, server as socketServer }
