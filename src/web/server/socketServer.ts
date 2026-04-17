import { Server } from 'socket.io'

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

            client.on('createBot', (profile) => {
                console.log('Creating bot with profile:', profile);
            });
        } else if (clientType === 'agent') {
            const { id, profile } = client.handshake.auth;
            console.log(`Agent connected: ${id}, profile: ${profile}`,);

            client.join('type:agents');
            client.join(`agent:${id}`);

            client.to('type:humans').emit('agentStatus', { id, username: profile.username, online: true });

            client.on('disconnect', () => {
                console.log(`Agent disconnected: ${id}`);
                client.to('type:humans').emit('agentStatus', { id, username: profile.username, online: false });
            });
        }
    });

    server.listen(port);
    return server;
}
