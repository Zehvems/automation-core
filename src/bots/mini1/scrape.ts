import axios from "axios";
import * as cheerio from "cheerio";
export async function scrape() {
  console.log("scraping...");
  const res = await axios.get("https://books.toscrape.com/");
  const $ = cheerio.load(res.data);
  return [];
}
