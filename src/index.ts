import * as cq from "go-cqwebsocket";
import * as child_process from "child_process";
import * as path from "path";
function startCQ(): Promise<void> {
  return new Promise((resolve, reject) => {
    const exe = path.resolve(process.cwd(), "bin", "go-cqhttp");
    const cqProcess = child_process.spawn(`${exe}`, {
      cwd: path.resolve(process.cwd(), "bin"),
    });
    cqProcess.stdout.addListener("data", (chunk) => {
      if (Buffer.isBuffer(chunk)) {
        const out = chunk.toString("utf-8");
        if (out.includes("127.0.0.1")) {
          resolve();
        }
      }
    });
    cqProcess.on("close", reject);
    cqProcess.on("error", reject);
    cqProcess.on("exit", reject);
    process.stdin.pipe(cqProcess.stdin);
    cqProcess.stdout.pipe(process.stdout);
  });
}

function bot() {
  const bot = new cq.CQWebSocket({});
  bot.on("message.group", ({ context: { group_id, message } }) => {
    console.log(group_id, message);
  });
}

async function main() {
  await startCQ();
  bot();
}
main()
  .catch(console.error)
  .finally(() => {
    console.log("Bot has been shut down.");
  });
