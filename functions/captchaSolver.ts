/**
 * Solves a captcha by summing up all the numbers in a given string.
 *
 * @param str - The string containing the captcha.
 * @returns The sum of all the numbers in the captcha string as a string, or an Error if the captcha cannot be solved.
 */
export default (str: string): string | Error => {
  if (str) {
    const numbers = str.match(/\d+/g);
    if (numbers) {
      const sum = numbers.reduce((acc, curr) => acc + parseInt(curr), 0);
      return sum.toString();
    }
  }
  return new Error("Gagal menyelesaikan captcha");
};
