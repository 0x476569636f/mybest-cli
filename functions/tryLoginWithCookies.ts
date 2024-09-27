import puppeteer from "puppeteer";
import getLocalCookies from "./getLocalCookies";
/**
 * Logs in with stored cookies.
 * @returns A promise that resolves to a boolean indicating whether the login was successful or not.
 */
export default async (): Promise<boolean> => {
  try {
    const cookies = await getLocalCookies();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setCookie(...cookies);
    await page.goto("https://elearning.bsi.ac.id/user/dashboard", {
      timeout: 10000,
    });

    const accountSettings = await page.$(".account-settings");
    if (accountSettings) {
      await browser.close();
      return true;
    } else {
      await browser.close();
      return false;
    }
  } catch (error) {
    console.error("Ada error:", error);
    return false;
  }
};
