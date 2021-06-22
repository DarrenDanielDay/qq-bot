import { createConfigIfNotExist } from "../client/config";
import { cwd } from "../constants/env";
import { access, child_process, path } from "../utils/node-utils";
import { startCQ } from "./start-process";

export async function main() {
  await createConfigIfNotExist();
  startQRCodeWatcher();
  await startCQ();
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
