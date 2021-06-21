export interface Command {
  prefix: string;
  exec(args: string[]): Promise<void | string>;
}
