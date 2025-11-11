import { promises as fs } from "fs";
import * as path from "path";

const LOG_PATH = path.resolve("data/logs/run.log");

export const log = {
  async info(msg: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const line = `[${timestamp}] ${msg}\n`;
    await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
    await fs.appendFile(LOG_PATH, line, "utf-8");
  },
};
