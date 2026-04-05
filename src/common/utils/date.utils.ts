// src/common/helpers/date.util.ts
export class DateUtil {
  // Current time as epoch milliseconds
  static now(): number {
    return Date.now();
  }

  // Date object → epoch milliseconds
  static toEpoch(date: Date): number {
    return date.getTime();
  }

  // Epoch milliseconds → Date object
  static toDate(epoch: number): Date {
    return new Date(epoch);
  }

  // Epoch milliseconds → readable string
  static toReadable(epoch: number): string {
    return new Date(epoch).toISOString();
  }

  // Add days to epoch → returns epoch
  static addDays(epoch: number, days: number): number {
    return epoch + days * 24 * 60 * 60 * 1000;
  }

  // Add months to epoch → returns epoch
  static addMonths(epoch: number, months: number): number {
    const date = new Date(epoch);
    date.setMonth(date.getMonth() + months);
    return date.getTime();
  }

  // Add weeks to epoch → returns epoch
  static addWeeks(epoch: number, weeks: number): number {
    return this.addDays(epoch, weeks * 7);
  }

  // Add years to epoch → returns epoch
  static addYears(epoch: number, years: number): number {
    const date = new Date(epoch);
    date.setFullYear(date.getFullYear() + years);
    return date.getTime();
  }

  // Difference in days between two epochs
  static daysDifference(epoch1: number, epoch2: number): number {
    return Math.ceil((epoch2 - epoch1) / (1000 * 60 * 60 * 24));
  }

  // Check if epoch is today
  static isToday(epoch: number): boolean {
    const date = new Date(epoch);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  // Check if epoch is in the past
  static isPast(epoch: number): boolean {
    return epoch < Date.now();
  }

  // Check if epoch is in the future
  static isFuture(epoch: number): boolean {
    return epoch > Date.now();
  }

  static isValidYYYYMMDD(value: number | string): boolean {
    const str = String(value);

    if (!/^\d{8}$/.test(str)) return false;

    const year = parseInt(str.substring(0, 4), 10);
    const month = parseInt(str.substring(4, 6), 10);
    const day = parseInt(str.substring(6, 8), 10);

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
