import * as util from "util";
import * as fs from "fs";
import * as child_process from "child_process";
import * as path from "path";
import { createInterface } from "readline";

export const read = util.promisify(fs.readFile);
export const write = util.promisify(fs.writeFile);
export const access = util.promisify(fs.access);
export function getLineInput() {
  const readline = createInterface({ input: process.stdin });
  return new Promise<string>((resolve) => {
    readline.once("line", (line) => {
      resolve(line);
      readline.close();
    });
  });
}
export function chunkToString(chunk: unknown) {
  if (Buffer.isBuffer(chunk)) {
    return chunk.toString("utf-8");
  }
  return "" + chunk;
}

export { path, child_process };
