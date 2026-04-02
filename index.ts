interface Settings {
    web_server_port: number;
    mc_server_ip: string;
    mc_server_port: number;
    postgres_host: string;
    postgres_port: number;
    postgres_db: string;
    postgres_user: string;
    postgres_password: string;
}

function parseEnv(): Settings {
    const env = process.env;

    const web_server_port = parseInt(env.WEB_SERVER_PORT ?? "3000");
    const mc_server_port = parseInt(env.MC_SERVER_PORT ?? "25565");

    return {
        web_server_port: isNaN(web_server_port) ? 3000 : web_server_port,
        mc_server_ip: env.MC_SERVER_IP ?? "127.0.0.1",
        mc_server_port: isNaN(mc_server_port) ? 25565 : mc_server_port,
        postgres_host: env.POSTGRES_HOST ?? "127.0.0.1",
        postgres_port: parseInt(env.POSTGRES_PORT ?? "5432"),
        postgres_db: env.POSTGRES_DB ?? "evocraft",
        postgres_user: env.POSTGRES_USER ?? "evocraft",
        postgres_password: env.POSTGRES_PASSWORD ?? ""
    }
}

function main() {
    const settings = parseEnv();

    console.log(settings);
}

main();
