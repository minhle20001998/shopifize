/* eslint-disable @typescript-eslint/ban-types */
import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsEnumArray(
  property: Object,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEnumArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: string[], args: ValidationArguments) {
          console.log(value, object, property);
          const enumValues = Object.values(property);
          const isValid = value.every((item) => {
            return enumValues.includes(item);
          });
          return isValid;
        },
      },
    });
  };
}
