import mineflayer from 'mineflayer';
import { pathfinder, Movements, goals } from 'mineflayer-pathfinder';
import { io } from './socket';

export const bot = mineflayer.createBot({
  username: 'AIMCBot',
  host: 'localhost',
  port: 25565,
});

bot.loadPlugin(pathfinder);

let defaultMovements: Movements;
let botReady = false;

const pendingActions = [];

bot.once("spawn", async () => {
  defaultMovements = new Movements(bot);
  bot.pathfinder.setMovements(defaultMovements);
  console.log("Bot spawned");
  botReady = true;
  for (const action of pendingActions) {
    await action(bot);
  }
  pendingActions.length = 0;
});

export function executeOnBot(action: (bot: mineflayer.Bot) => void | Promise<void>) {
  if (!botReady) {
    pendingActions.push(action);
    return;
  }

  action(bot);
}

export function makeBotChat(text: string, speakLoudly = true) {
  executeOnBot((bot) => {
    bot.chat(text);
    if (speakLoudly) io.emit("chat", text);
  });
}