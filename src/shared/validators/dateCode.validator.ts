// validators/is-yyyymmdd.validator.ts
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DateUtil } from 'src/common/utils/date.utils';

@ValidatorConstraint({ name: 'IsYYYYMMDD', async: false })
export class IsYYYYMMDDConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments): boolean {
    if (typeof value !== 'number' && typeof value !== 'string') return false;
    return DateUtil.isValidYYYYMMDD(value);
  }

  defaultMessage(_args: ValidationArguments): string {
    return `$property must be a valid date in YYYYMMDD format (e.g. 20240315)`;
  }
}

export function IsValidDateCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsYYYYMMDDConstraint,
    });
  };
}
