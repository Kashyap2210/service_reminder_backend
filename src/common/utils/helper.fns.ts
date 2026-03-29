import { BadRequestException } from '@nestjs/common';
import { IAuditColumnEntity } from '../helpers/audit-column.entity.interface';

export function getObjectDiffingKeys<T extends Record<string, any>>(
  oldObject: T,
  newObject: T,
): Partial<T> {
  const keysToExclude: (keyof IAuditColumnEntity)[] = [
    'createdOn',
    'createdBy',
  ];
  const keysOfOldObject = Object.keys(oldObject);
  const keysOfNewObject = Object.keys(newObject);

  if (keysOfOldObject.length !== keysOfNewObject.length) {
    throw new BadRequestException({
      key: 'objects',
      message: `Different objects recieved for diffing. Please check & try again.`,
    });
  }

  const oldDiffingKeys = {} as T;
  const newDiffingKeys = {} as Partial<T>;

  for (const key of keysOfOldObject as Array<keyof T>) {
    if (keysToExclude.includes(key as keyof IAuditColumnEntity)) continue;

    const oldVal = oldObject[key];
    const newVal = newObject[key];

    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      oldDiffingKeys[key] = oldVal;
      newDiffingKeys[key] = newVal;
    }
  }

  return newDiffingKeys;
}

/**
 * Compares two arrays and returns the difference between them.
 *
 * @template T - The type of elements in the arrays
 * @param {T[]} arr1 - The original array
 * @param {T[]} arr2 - The new array to compare against
 * @returns {{ present: T[], deleted: T[], added: T[] }} An object containing:
 * - `present` — items found in both arrays (intersection)
 * - `deleted` — items in `arr1` but not in `arr2`
 * - `added`   — items in `arr2` but not in `arr1`
 *
 * @example
 * const arr1 = [1, 2, 3, 4];
 * const arr2 = [3, 4, 5, 6];
 *
 * diffArrays(arr1, arr2);
 * // {
 * //   present: [3, 4],
 * //   deleted: [1, 2],
 * //   added:   [5, 6]
 * // }
 */
export function diffArrays<T>(arr1: T[], arr2: T[]) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  return {
    present: arr1.filter((item) => set2.has(item)),
    deleted: arr1.filter((item) => !set2.has(item)),
    added: arr2.filter((item) => !set1.has(item)),
  };
}
