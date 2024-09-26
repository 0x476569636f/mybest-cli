import fs from "fs/promises";
import path from "path";

const getLocalCookies = async () => {
  try {
    const cookiesPath = path.resolve(__dirname, "../cookies.json");
    const storedCookies = await fs.readFile(cookiesPath, "utf-8");
    const cookies = JSON.parse(storedCookies);
    return cookies;
  } catch (error) {
    console.error("Cookies tidak ditemukan, silahkan login terlebih dahulu");
  }
};

export default getLocalCookies;
