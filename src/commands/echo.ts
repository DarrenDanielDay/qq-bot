import type { Command } from "./schema";

let on = true;

export const echo: Command = {
  prefix: "echo",
  async exec(args) {
    if (!on) return "复读机关了";
    console.log("复读了以下内容", args);
    return `只是复读一下而已：${args.join(" ")}`;
  },
};

export const echoSwitch: Command = {
  prefix: "echo-switch",
  async exec() {
    on = !on;
  },
};
