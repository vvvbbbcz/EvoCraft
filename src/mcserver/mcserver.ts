import mc from 'minecraft-protocol';

interface MCServerInfo {
    host: string,
    port: number,
    version: string | null,
    desc?: string,
    ping?: number,
}

/**
 * Scans the IP address for Minecraft LAN servers and collects their info.
 * @param {string} ip - The IP address to scan.
 * @param {number} port - The port to check.
 * @param {number} timeout - The connection timeout in ms.
 * @returns {Promise<Array>} - A Promise that resolves to an array of server info objects.
 */
export async function serverInfo(ip: string, port: number, timeout = 1000): Promise<MCServerInfo | null> {
    let response = await mc.ping({
        host: ip,
        port,
        closeTimeout: timeout,
        noPongTimeout: timeout
    }).catch(_err => null);

    if (!response) return null;

    // extract version number from modded servers like "Paper 1.21.4"
    const version = typeof response.version === 'string' ? response.version : response.version.name;
    const match = String(version).match(/\d+\.\d+(?:\.\d+)?/);
    const numericVersion = match ? match[0] : null;
    if (numericVersion !== version) {
        console.log(`Modded server found (${version}), attempting to use ${numericVersion}...`);
    }

    let desc = 'description' in response ? response.description : undefined;

    return {
        host: ip,
        port,
        desc: typeof desc === "string" ? desc : desc?.text,
        ping: 'latency' in response ? response.latency : undefined,
        version: numericVersion
    };
}

/**
 * Gets the MC server info from the host and port.
 * @param {string} host - The host to search for.
 * @param {number} port - The port to search for.
 * @param {string} version - The version to search for.
 * @returns {Promise<Object>} - A Promise that resolves to the server info object.
 */
export async function getServer(host: string, port: number, version?: string) {
    const server = await serverInfo(host, port, 1000);

    // Server not found
    if (server == null)
        throw new Error(`MC server not found. (Host: ${host}, Port: ${port}).`);

    const serverString = `(Host: ${server.host}, Port: ${server.port}, Version: ${server.version})`;
    const serverVersion = version === undefined ? (server.version ?? "null") : version;

    // Server version unsupported / mismatch
    if (mc.supportedVersions.indexOf(serverVersion) === -1) {
        throw new Error(`MC server was found ${serverString}, but version is unsupported. Supported versions are: ${mc.supportedVersions.join(", ")}.`);
    } else if (version !== undefined && server.version !== version) {
        throw new Error(`MC server was found ${serverString}, but version is incorrect. Expected ${version}.`);
    }

    return server;
}
