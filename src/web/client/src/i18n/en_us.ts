export default {
    appName: "EvoCraft",
    appState: {
        socket: {
            online: "Online",
            offline: "Offline",
        }
    },
    page: {
        bots: {
            newBot: "New Bot",
            add: {
                username: "Username",
                auth: {
                    title: "Authentication Method",
                    offline: "Offline",
                },
                validation: {
                    username: {
                        required: "Username is required",
                    },
                    auth: {
                        required: "Authentication method is required",
                    }
                },
                submit: "Create"
            },
            status: {
                spawned: {
                    true: "Spawned",
                    false: "Not Spawned",
                }
            }
        }
    }
}
