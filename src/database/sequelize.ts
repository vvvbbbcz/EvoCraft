import { Sequelize } from "sequelize";
import bot from "./model/bot.ts";

function init() { }

const sequelize = new Sequelize(process.env.POSTGRES_URL ?? "");
await sequelize.authenticate().then(_ => {
    console.log("Connected to database")
}).catch(err => {
    console.error(`Failed to connect to database: ${err}`)
    process.exit(255)
})

export const Bot = bot.init(sequelize);

await sequelize.sync()

export default { init }
