import { promises as fs } from "fs";
import * as path from "path";
export async function writeJsonSafe(p: string, data: unknown) {
  await fs.mkdir(p, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(p, `run-${timestamp}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  return filePath;
}
