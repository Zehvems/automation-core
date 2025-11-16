import { chromium } from "playwright";

export async function grabScreenshot(
  url: string,
  outputPath: string
): Promise<void> {
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url);
    await page.screenshot({ path: outputPath });
  } finally {
    await browser.close();
  }
}
