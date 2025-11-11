import { scrape } from "./scrape";
import { writeJsonSafe } from "../../utils/file";
import { log } from "../../utils/log";

export async function run() {
  const data = await scrape();
  console.log(`Data: ${data.length}`);
  const filepath = await writeJsonSafe("data/out", data);
  console.log(`Saved file to ${filepath}`);
  await log.info(`OK count=${data.length}`);
}
