import axios from "axios";
import * as cheerio from "cheerio";

type Book = { title: string; price: number; url: string };

export async function scrape() {
  console.log("scraping...");
  const res = await axios.get("https://books.toscrape.com/");
  const $ = cheerio.load(res.data);
  const books: Book[] = [];
  $(".product_pod").each((_, el) => {
    const url = $(el).find("h3 a").attr("href") ?? "";
    const title = $(el).find("h3 a").text();
    const priceText = $(el).find(".price_color").text();
    const price = parseFloat(priceText.replace("£", ""));
    const book = { title, price, url };
    books.push(book);
    console.log("Book", _ + 1);
  });
  return books;
}
