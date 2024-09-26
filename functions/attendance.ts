import puppeteer from "puppeteer";
import getLocalCookies from "./getLocalCookies";

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
