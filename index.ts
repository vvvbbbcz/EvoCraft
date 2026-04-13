import 'dotenv/config';
import { createWebSocket } from './src/web/server/socketServer.ts';
import { Sequelize } from 'sequelize';

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

const database = new Sequelize(settings.postgres_url);
database.authenticate().then(_ => {
    console.log("Connected to database")
}).catch(err => {
    console.error(`Failed to connect to database: ${err}`)
    process.exit(255)
})

const server = createWebSocket(settings.socket_port);

export { settings as appSettings, server as socketServer, database }
