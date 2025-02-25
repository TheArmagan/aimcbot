import { executeOnBot, makeBotChat } from "@src/bot";
import { addSpeechTrigger } from "@src/triggers";
import { turkishToASCII } from "@src/utils";
import { goals } from "mineflayer-pathfinder";
import similarity from "similarity";

let ownerName: string | null = null;

addSpeechTrigger(/sahibini ([^ ]+) olarak ayarla/i, (text, matchResponse) => {
  let playerName = turkishToASCII(matchResponse[1]);
  executeOnBot(async (bot) => {
    ownerName = Object.values(bot.players).sort((a, b) => similarity(b.username, playerName) - similarity(a.username, playerName))[0].username;
    makeBotChat(`Sahibimin adı ${ownerName}`);
  });
});

addSpeechTrigger(/sahibin kim/i, () => {
  executeOnBot(async (bot) => {
    if (!ownerName) {
      return makeBotChat("Sahibimin adını bilmiyorum");
    };

    makeBotChat(`Sahibim ${ownerName}`);
  });
});

addSpeechTrigger(/yanima gel/i, () => {
  executeOnBot(async (bot) => {
    if (!ownerName) {
      return makeBotChat("Sahibimin adını bilmiyorum");
    };

    bot.pathfinder.setGoal(
      new goals.GoalFollow(bot.players[ownerName].entity, 2),
      true
    );

    makeBotChat("Sahibimin yanına gidiyorum");
  });
});

addSpeechTrigger(/beni takip etme/i, () => {
  executeOnBot(async (bot) => {
    bot.pathfinder.setGoal(null);
    makeBotChat("Sahibimi takip etmeyi bıraktım");
  });
});