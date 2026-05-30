export default {
    appName: "EvoCraft",
    appState: {
        socket: {
            online: "在线",
            offline: "离线",
        }
    },
    page: {
        bots: {
            newBot: "创建 Bot",
            add: {
                username: "用户名",
                auth: {
                    title: "认证方式",
                    offline: "离线模式",
                },
                validation: {
                    username: {
                        required: "用户名为必填项",
                    },
                    auth: {
                        required: "认证方式为必填项",
                    }
                },
                submit: "创建"
            },
            status: {
                spawned: {
                    true: "已生成",
                    false: "未生成",
                }
            }
        }
    }
}
