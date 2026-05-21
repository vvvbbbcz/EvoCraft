import { Server } from 'socket.io'
import { Bot } from '../../database/sequelize.ts';
import { botManager } from '../../bot/bot.ts';
import { appSettings } from '../../../index.ts';

export function createWebSocket(port = 3000) {
    console.log(`Starting socket server on ${port}`)

    const server = new Server({ cors: {} });

    const humanNamespace = server.of('/human');
    const botNamespace = server.of('/bot');

    humanNamespace.on('connection', (client) => {
        console.log('A human connected');

        client.on('createBot', async (profile) => {
            console.log('Creating bot with profile:', profile);

            await Bot.create({ username: profile.username, auth: profile.auth })
                .then(async (bot) => {
                    await botManager.createAgent(bot.id, {
                        profile,
                        server: {
                            host: appSettings.mc_server_host,
                            port: appSettings.mc_server_port,
                            version: appSettings.mc_server_version
                        }
                    });
                })
                .catch(err => {
                    console.error(`Failed to create bot in database: ${err}`);
                });
        });

        client.on('listBots', async () => {
            const bots = botManager.listAgents();
            client.emit('listBots', bots);
        });
    });

    botNamespace.on('connection', (client) => {
        const { id, profile } = client.handshake.auth;
        console.log(`Agent connected, id: ${id}, username: ${profile.username}`);

        client.join(`bot:${id}`);

        humanNamespace.emit('botStatus', id, { username: profile.username, online: true });

        client.on('disconnect', () => {
            console.log(`Agent disconnected: ${id}`);
            client.leave(`bot:${id}`);
            humanNamespace.emit('botStatus', id, { online: false });
        });
    });

    server.listen(port);
    return server;
}
