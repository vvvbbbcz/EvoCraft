import { Server } from 'socket.io'
import { Bot } from '../../database/sequelize.ts';
import { botManager } from '../../bot/bot.ts';
import { appSettings } from '../../../index.ts';

export function createWebSocket(port = 3000) {
    console.log(`Starting socket server on ${port}`)

    const server = new Server({ cors: {} });

    server.use((socket, next) => {
        const { clientType } = socket.handshake.auth;
        if (clientType === 'human' || clientType === 'agent') {
            next();
        } else {
            next(new Error('Invalid client type'));
        }
    });

    server.on('connection', (client) => {
        const { clientType } = client.handshake.auth;

        if (clientType === 'human') {
            client.join('type:humans');

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
        } else if (clientType === 'agent') {
            const { id, profile } = client.handshake.auth;
            console.log(`Agent connected: ${id}, profile: ${profile}`,);

            client.join('type:agents');
            client.join(`agent:${id}`);

            client.to('type:humans').emit('botStatus', id, { username: profile.username, online: true });

            client.on('disconnect', () => {
                console.log(`Agent disconnected: ${id}`);
                client.to('type:humans').emit('botStatus', id, { username: profile.username, online: false });
            });
        }
    });

    server.listen(port);
    return server;
}
