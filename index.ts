import 'dotenv/config';
import { createWebSocket } from './src/web/server/socketServer.ts';

interface Settings {
    socket_port: number;
    postgres_host: string;
    postgres_port: number;
    postgres_db: string;
    postgres_user: string;
    postgres_password: string;
}

function parseEnv(): Settings {
    const env = process.env;

    const socket_server_port = parseInt(env.SOCKET_SERVER_PORT ?? "3000");

    return {
        socket_port: isNaN(socket_server_port) ? 3000 : socket_server_port,
        postgres_host: env.POSTGRES_HOST ?? "127.0.0.1",
        postgres_port: parseInt(env.POSTGRES_PORT ?? "5432"),
        postgres_db: env.POSTGRES_DB ?? "evocraft",
        postgres_user: env.POSTGRES_USER ?? "evocraft",
        postgres_password: env.POSTGRES_PASSWORD ?? ""
    }
}

const settings = parseEnv();
const server = createWebSocket(settings.socket_port);

export { settings as appSettings, server as socketServer }
