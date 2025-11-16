import { scrape } from "./scrape";
import { writeJsonSafe } from "../../utils/file";
import { log } from "../../utils/log";
import { grabScreenshot } from "./browser";
import path from "path";
let safeName = 0;

export async function run() {
  const data = await scrape();
  console.log(`Data: ${data.length}`);
  const filepath = await writeJsonSafe("data/out", data);
  console.log(`Saved file to ${filepath}`);
  await log.info(`OK count=${data.length}`);

  for (const book of data) {
    const timestamp = new Date().toISOString().slice(19, 23).replace(".", "");
    const outputPath = path.join(
      "data",
      "screens",
      `${(safeName++).toString() + timestamp}.png`
    );
    const url = book.url;
    await grabScreenshot(url, outputPath);
    console.log(outputPath);
  }
}
