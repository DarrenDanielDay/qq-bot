import type { CQWebSocket } from "go-cqwebsocket";
import type { Command } from "./schema";

export async function groupCommandHandler(
  message: string,
  commands: Command[],
  bot: CQWebSocket,
  group_id: number
) {
  const [prefix, ...args] = message.split(" ");
  for (const command of commands.filter(
    (command) => command.prefix === prefix
  )) {
    const result = await command.exec(args);
    if (result) {
      await bot.send_group_msg(group_id, result);
    }
  }
}
