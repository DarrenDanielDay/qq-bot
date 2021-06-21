import * as cq from "go-cqwebsocket";
import * as child_process from "child_process";
import * as path from "path";
import * as util from "util";
import * as fs from "fs";
import { createInterface } from "readline";

const read = util.promisify(fs.readFile);
const write = util.promisify(fs.writeFile);
const access = util.promisify(fs.access);
const cwd = process.cwd();
function getLineInput() {
  const readline = createInterface({ input: process.stdin });
  return new Promise<string>((resolve) => {
    readline.once("line", (line) => {
      resolve(line);
      readline.close();
    });
  });
}
async function createConfig() {
  console.log("正在检查配置");
  const configPath = path.resolve(cwd, "bin", "config.yml");
  try {
    await access(configPath);
  } catch {
    console.log("未找到配置，请输入QQ号，并用手机扫码登录");
    const qq = await getLineInput();
    // 生成配置
    const templatePath = path.resolve(
      process.cwd(),
      "bin",
      "config-template.yml"
    );
    const template = await read(templatePath, { encoding: "utf-8" });
    const config = template.replace('"QQ Number"', qq);
    await write(configPath, config);
  }
}

function chunkToString(chunk: unknown) {
  if (Buffer.isBuffer(chunk)) {
    return chunk.toString("utf-8");
  }
  return "" + chunk;
}

function logChunk(chunk: unknown) {
  console.log(chunkToString(chunk));
}

function startCQ() {
  console.log("正在创建go-cqhttp后台进程");
  const exe = path.resolve(cwd, "bin", "go-cqhttp.exe");
  const cqProcess = child_process.spawn(`${exe}`, {
    cwd: path.resolve(cwd, "bin"),
  });
  cqProcess.stdout.addListener("data", logChunk);
  cqProcess.stderr.addListener("data", logChunk);
  return new Promise<void>((resolve) => {
    const resolveWhenReady: (chunk: any) => void = (chunk) => {
      if (chunkToString(chunk).includes("127.0.0.1")) {
        resolve();
      }
    };
    cqProcess.stdout.addListener("data", resolveWhenReady);
    cqProcess.stderr.addListener("data", resolveWhenReady);
  });
}

async function startBot() {
  console.log("正在启动机器人");
  const bot = new cq.CQWebSocket({});
  bot.connect();
  registerBotHandlers(bot);
}

async function registerBotHandlers(bot: cq.CQWebSocket) {
  bot.on("message.group", ({ context: { group_id, message } }) => {
    console.log(group_id, message);
  });
  bot.on("message.private", ({ context: { message, user_id } }) => {
    console.log(user_id, message);
  });
  bot.on("socket.close", () => {
    console.log("socket连接关闭");
  });
}

function startQRCodeWatcher() {
  const interval = setInterval(async () => {
    const qrCodePath = path.resolve(cwd, "bin", "qrcode.png");
    try {
      await access(qrCodePath);
    } catch (error) {
      return;
    }
    clearInterval(interval);
    setTimeout(() => {
      child_process.execSync(`code ${qrCodePath}`);
    }, 1000);
  }, 1000);
}
async function main() {
  await createConfig();
  startQRCodeWatcher();
  await startCQ();
  startBot();
}
main();
