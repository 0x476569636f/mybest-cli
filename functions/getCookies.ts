import puppeteer from "puppeteer";
import fs from "node:fs/promises";
import captchaSolver from "./captchaSolver";

/**
 * Retrieves cookies from a website after logging in using Puppeteer.
 * @param nim - The username for logging in.
 * @param password - The password for logging in.
 * @returns A Promise that resolves to void.
 */
export default async (nim: string, password: string): Promise<void> => {
  const browser = await puppeteer.launch({
    args: ["--incognito"],
  });
  const page = await browser.newPage();
  await page.goto("https://elearning.bsi.ac.id/login", {
    timeout: 5000,
  });
  await page.type('input[name="username"]', nim);
  await page.type('input[name="password"]', password);
  const captchaDomRef = await page.$("#captcha_question");
  const captchaTextContent = await captchaDomRef?.evaluate(
    (el) => el.textContent
  );
  const answer = captchaSolver(captchaTextContent as string);
  if (answer instanceof Error) {
    console.error(answer.message);
    await browser.close();
    return;
  }
  await page.type("#captcha_answer", answer);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  if (await page.$(".account-settings")) {
    try {
      const cookies = await page.cookies();
      fs.writeFile("cookies.json", JSON.stringify(cookies, null, 2));
    } catch (error) {
      console.error("error saat menyimpan cookies", error);
    } finally {
      await browser.close();
    }
  } else {
    await browser.close();
    throw new Error("Login gagal silahkan coba lagi");
  }
};
