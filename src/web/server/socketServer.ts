import { Server } from 'socket.io'

export function createWebSocket(port = 3000) {
    console.log(`Starting socket server on ${port}`)

    const server = new Server();

    server.listen(port);
    return server;
}
