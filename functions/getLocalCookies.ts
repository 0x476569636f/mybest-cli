import fs from "fs/promises";
import path from "path";

/**
 * Retrieves local cookies from the specified file path.
 * @returns {Promise<any>} A promise that resolves to the retrieved cookies.
 * @throws {Error} If the cookies file is not found or an error occurs while reading the file.
 */
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
