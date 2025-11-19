import axios from "axios";
import * as cheerio from "cheerio";

export type Book = { title: string; price: number; url: string };

export async function scrape() {
  console.log("scraping...");
  const res = await axios.get("https://books.toscrape.com/");
  const $ = cheerio.load(res.data);
  const books: Book[] = [];
  $(".product_pod").each((_, el) => {
    const href = $(el).find("h3 a").attr("href") ?? "";
    const url = new URL(href, "https://books.toscrape.com/").toString();
    const title = $(el).find("h3 a").text();
    const priceText = $(el).find(".price_color").text();
    const price = parseFloat(priceText.replace("£", ""));
    const book: Book = { title, price, url };
    books.push(book);
  });

  return books;
}
