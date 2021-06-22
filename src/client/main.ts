import type { Command } from "../commands/schema";
import * as cq from "go-cqwebsocket";
import { groupCommandHandler } from "../commands/handler";
import { echo, echoSwitch } from "../commands/echo";
function startBot() {
  console.log("正在启动机器人");
  const bot = new cq.CQWebSocket({});
  bot.connect();
  registerBotHandlers(bot);
}
const commands: Command[] = [echo, echoSwitch];
async function registerBotHandlers(bot: cq.CQWebSocket) {
  bot.on("message.group", ({ context: { group_id, message }, bot }) => {
    if (typeof message === "string") {
      groupCommandHandler(message, commands, bot, group_id);
    }
  });
  bot.on("socket.close", () => {
    console.log("socket连接关闭");
  });
}
export async function main() {
  startBot();
}
