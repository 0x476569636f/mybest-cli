import puppeteer from "puppeteer";
import getLocalCookies from "./getLocalCookies";

/**
 * Performs attendance by launching a Puppeteer browser, setting local cookies, and navigating to the specified link.
 *
 * @param link - The URL to navigate to for attendance.
 * @throws {Error} - Throws an error if the attendance fails.
 */
export default async (link: string) => {
  const cookies = await getLocalCookies();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setCookie(...cookies);
  await page.goto(link, {
    waitUntil: "domcontentloaded",
  });

  try {
    await page.waitForSelector(".info-tiles");
    await page.click(".info-tiles button");
  } catch (error) {
    throw new Error("Gagal melakukan absen");
  }

  await browser.close();
};
