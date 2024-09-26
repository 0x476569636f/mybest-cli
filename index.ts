import prompts, { type PromptObject } from "prompts";
import getCookies from "./functions/getCookies";
import checkCookiesExpiration from "./functions/checkCookiesExpiration";
import loginWithCookies from "./functions/tryLoginWithCookies";
import fs from "node:fs/promises";
import path from "node:path";
import getClassSchedule from "./functions/getClassSchedule.js";
import attendance from "./functions/attendance.js";

const loginPrompts: PromptObject[] = [
  {
    type: "text",
    name: "nim",
    message: "Masukan NIM Anda:",
  },
  {
    type: "password",
    name: "password",
    message: "Masukan password Anda:",
  },
];

const menuPrompts: PromptObject[] = [
  {
    type: "select",
    name: "menu",
    message: "Pilih menu",
    choices: [
      { title: "Absen", value: "absen" },
      { title: "Lihat jadwal", value: "schedule" },
      { title: "Auto absen?", value: "autoAbsen" },
      { title: "Keluar", value: "exit" },
    ],
  },
];

let running = true;

const checkCookiesExistence = async (): Promise<boolean> => {
  try {
    const cookiesPath = path.resolve(__dirname, "./cookies.json");
    await fs.access(cookiesPath, fs.constants.F_OK);
    return true;
  } catch (error) {
    console.error("Cookies tidak ditemukan, silahkan login terlebih dahulu");
    return false;
  }
};

const promptLogin = async (): Promise<void> => {
  const responses = await prompts(loginPrompts);
  await getCookies(responses.nim, responses.password);
};

const handleMenuSelection = async (): Promise<void> => {
  const menuResponses = await prompts(menuPrompts);
  const d: any = await getClassSchedule();

  const choices = d.map((item: any) => ({
    title: item.title,
    value: item.links[0],
  }));
  switch (menuResponses.menu) {
    case "absen":
      const responses = await prompts([
        {
          type: "select",
          name: "link",
          message: "Pilih mata kuliah",
          choices: choices,
        },
      ]);

      await attendance(responses.link);

      break;
    case "schedule":
      d.map((data: any) =>
        console.log({
          matkul: data.title,
          jadwal: data.schedule,
          lecturerCode: data.lecturerCode,
          courseCode: data.courseCode,
          ruangan: data.roomNumber,
          sks: data.sks,
        })
      );

      break;
    case "autoAbsen":
      console.log("Coming soon");
      break;
    case "exit":
      running = false;
      break;
  }
};

(async () => {
  let cookiesIsExist = await checkCookiesExistence();

  while (running) {
    if (!cookiesIsExist) {
      await promptLogin();
      cookiesIsExist = await checkCookiesExistence();
    }

    const cookiesExpired = await checkCookiesExpiration();
    const loginSuccessful = await loginWithCookies();

    if (cookiesExpired || !loginSuccessful) {
      await promptLogin();
      cookiesIsExist = await checkCookiesExistence();
    } else {
      await handleMenuSelection();
    }
  }
})();
