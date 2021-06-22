import { cwd } from "../constants/env";
import { child_process, chunkToString, path } from "../utils/node-utils";

export function startCQ() {
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
function logChunk(chunk: unknown) {
  console.log(chunkToString(chunk));
}
