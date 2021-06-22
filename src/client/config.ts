import { cwd } from "../constants/env";
import { access, getLineInput, path, read, write } from "../utils/node-utils";

export async function createConfigIfNotExist() {
  console.log("正在检查配置");
  const configPath = path.resolve(cwd, "bin", "config.yml");
  try {
    await access(configPath);
  } catch {
    console.log("未找到配置，请输入QQ号，并用手机扫码登录");
    const qq = await getLineInput();
    // 生成配置
    const templatePath = path.resolve(cwd, "bin", "config-template.yml");
    const template = await read(templatePath, { encoding: "utf-8" });
    const config = template.replace('"QQ Number"', qq);
    await write(configPath, config);
  }
}
