import { Book } from "../bots/mini1/scrape";
export function raport(data: Array<Book>) {
  const count = data.length;
  const avgPrice = (
    data.reduce((acc, book) => acc + book.price, 0) / count
  ).toFixed(2);

  return { count, avgPrice };
}
