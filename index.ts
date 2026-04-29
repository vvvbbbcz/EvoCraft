import 'dotenv/config';
import { createWebSocket } from './src/web/server/socketServer.ts';
import sequelize, { Bot } from './src/database/sequelize.ts';

interface Settings {
    socket_port: number;
    postgres_url: string;
}

function parseEnv(): Settings {
    const env = process.env;

    const socket_server_port = parseInt(env.SOCKET_SERVER_PORT ?? "3000");

    return {
        socket_port: isNaN(socket_server_port) ? 3000 : socket_server_port,
        postgres_url: env.POSTGRES_URL ?? "",
    }
}

const settings = parseEnv();

sequelize.init();

const server = createWebSocket(settings.socket_port);

try {
    for (const bot of await Bot.findAll()) {
        console.log(`Loaded bot: ${bot.username}`)
    }
} catch (err) {
    console.error(`Failed to load bots: ${err}`)
}

export { settings as appSettings, server as socketServer }
