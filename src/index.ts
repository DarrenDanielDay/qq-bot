import { cwd } from "./constants/env";
import { path } from "./utils/node-utils";
import { main as server } from "./server/main";
import { main as client } from "./client/main";

export async function main() {
  await server();
  client();
}

if (path.resolve(__dirname, "..") === cwd) {
  main();
}
