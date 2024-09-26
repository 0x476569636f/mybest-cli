import puppeteer from "puppeteer";
import getLocalCookies from "./getLocalCookies";

/**
 * Retrieves class schedule data from the elearning website.
 * @returns A Promise that resolves to an array of class schedule data.
 */
export default async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const cookies = await getLocalCookies();
  await page.setCookie(...cookies);
  await page.goto("https://elearning.bsi.ac.id/sch");

  const data: any[] = await page.evaluate(() => {
    const rows = document.querySelectorAll(".row.gutters .pricing-plan");
    return Array.from(rows).map((row) => {
      const title =
        (row.querySelector(".pricing-title") as HTMLElement)?.innerText ?? "";
      const schedule =
        (row.querySelector(".pricing-save") as HTMLElement)?.innerText ?? "";
      const lecturerCode =
        (row.querySelector(".icon-user")?.parentElement as HTMLElement)
          ?.innerText ?? "";
      const courseCode =
        (row.querySelector(".icon-local_library")?.parentElement as HTMLElement)
          ?.innerText ?? "";
      const sks =
        (
          row.querySelector(".icon-confirmation_number")
            ?.parentElement as HTMLElement
        )?.innerText ?? "";
      const roomNumber =
        (row.querySelector(".icon-address")?.parentElement as HTMLElement)
          ?.innerText ?? "";
      const practiceGroup =
        (
          row.querySelector(".icon-people_outline")
            ?.parentElement as HTMLElement
        )?.innerText ?? "";
      const joinCode =
        (row.querySelector(".icon-bookmarks")?.parentElement as HTMLElement)
          ?.innerText ?? "";

      const links = Array.from(row.querySelectorAll(".pricing-footer a")).map(
        (a) => (a as HTMLAnchorElement).href
      );
      return {
        title,
        schedule,
        lecturerCode,
        courseCode,
        sks,
        roomNumber,
        practiceGroup,
        joinCode,
        links,
      };
    });
  });

  await browser.close();
  return data;
};
