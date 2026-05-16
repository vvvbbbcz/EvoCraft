import type { BotSettings } from "../bot.ts";
import { createBot } from "mineflayer";
import { pathfinder } from 'mineflayer-pathfinder';
import { plugin as pvp } from 'mineflayer-pvp';
import { plugin as collectBlock } from 'mineflayer-collectblock';
import { loader as autoEat } from 'mineflayer-auto-eat';
import armorManager from 'mineflayer-armor-manager';

export function initMineflayerBot(settings: BotSettings) {
    const bot = createBot({
        username: settings.profile.username,
        host: settings.server.host,
        port: settings.server.port,
        auth: settings.profile.auth,
        version: settings.server.version,
    });

    bot.loadPlugin(pathfinder);
    bot.loadPlugin(pvp);
    bot.loadPlugin(collectBlock);
    bot.loadPlugin(autoEat);
    bot.loadPlugin(armorManager);

    bot.once('resourcePack', () => {
        bot.acceptResourcePack();
    });

    return bot;
}
