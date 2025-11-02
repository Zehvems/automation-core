import axios from "axios";
import { data } from "cheerio/dist/commonjs/api/attributes";
export async function scrape() {
  console.log("scraping...");
  const res = await axios.get("https://books.toscrape.com/");
  console.log(Object.keys(res));
  console.log(res.data);
  return [];
}
