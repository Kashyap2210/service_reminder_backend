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
