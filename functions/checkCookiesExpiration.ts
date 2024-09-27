import getLocalCookies from "./getLocalCookies";

/**
 * Checks if the cookies have expired.
 * @returns A promise that resolves to a boolean indicating whether the cookies have expired.
 */
export default async (): Promise<boolean> => {
  try {
    const cookies = await getLocalCookies();
    const now = Math.floor(Date.now() / 1000);
    const expired = cookies.some(
      (cookie: { expires: number }) => cookie.expires < now
    );
    return expired;
  } catch (error) {
    console.error("Error checking cookies expiration:", error);
    return true;
  }
};
