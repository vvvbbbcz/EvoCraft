import { io, Socket } from 'socket.io-client';
import { Agent } from '../agent/agent.ts';

export class SocketProxy {
    // name?: string;
    port: number;
    client?: Socket;
    connected = false;
    agent?: Agent;

    constructor(port: number) {
        this.port = port;
    }

    async connect(port: number) {
        if (this.client !== undefined) return;

        this.client = io(`http://localhost:${port}`, {
            auth: {
                clientType: "agent"
            }
        });

        await new Promise((resolve, reject) => {
            this.client?.on('connect', () => resolve(undefined));
            this.client?.on('connect_error', (err) => {
                console.error('Connection failed:', err);
                reject(err);
            });
        });

        this.connected = true;
        console.log(this.agent?.settings.profile.username, 'connected to SocketServer');

        this.client.on('disconnect', () => {
            console.log('Disconnected from SocketServer');
            this.connected = false;
            if (this.agent) {
                this.agent.killAll('Disconnected from SocketServer. Killing agent process.');
            }
        });

        this.client.on('restart-agent', (agentName: string) => {
            console.log(`Restarting agent: ${agentName}`);
            this.agent?.killAll();
        });
    }

    login() {
        this.client?.emit('bot-login', this.agent?.id);
    }

    shutdown() {
        this.client?.emit('bot-shutdown', this.agent?.id);
    }

    getSocket() {
        return this.client;
    }
}
