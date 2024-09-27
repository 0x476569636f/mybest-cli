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
    waitUntil: "networkidle0",
  });

  try {
    const formButton = await page.$(
      "form[action='/mhs-absen'] button[type='submit']"
    );

    if (!formButton) {
      throw new Error("Absen belum dibuka");
    }

    await page.evaluate((button) => button.click(), formButton);
    await page.waitForNavigation();
    const commentForm = await page.$("form[action='/komentar-mhs']");
    if (commentForm) {
      console.log("Absen berhasil");
    }
  } catch (error) {
    console.error("Error during attendance:", error);
    throw new Error("Gagal melakukan absen");
  } finally {
    await browser.close();
  }
};
