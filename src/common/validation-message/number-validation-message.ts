import { ValidationArguments } from 'class-validator';

export const numberValidationMessage = (args: ValidationArguments) => {
  return `${args.property}은 number type으로 입력해주세요.`;
};
