/**
 * Utility class for validating date codes in `YYYYMMDD` format.
 *
 * @example new DateCodeUtils(20240315)
 *
 * @methods
 * - `isValidYYYYMMDD()` — checks if the date code is a real calendar date. e.g. `new DateCodeUtils(20240315).isValidYYYYMMDD() // true`
 */
export class DateCodeUtils {
  stringifiedDateCode: string;
  constructor(private readonly dateCode: string | number) {
    this.stringifiedDateCode = String(this.dateCode);
  }

  isValidYYYYMMDD(): boolean {
    if (!/^\d{8}$/.test(this.stringifiedDateCode)) return false;

    const year = parseInt(this.stringifiedDateCode.substring(0, 4), 10);
    const month = parseInt(this.stringifiedDateCode.substring(4, 6), 10);
    const day = parseInt(this.stringifiedDateCode.substring(6, 8), 10);

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }
}
