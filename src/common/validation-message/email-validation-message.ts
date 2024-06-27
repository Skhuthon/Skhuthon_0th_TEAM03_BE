import { ValidationArguments } from 'class-validator';

export const emailValidationMessgae = (args: ValidationArguments) => {
  return `${args.property}는 이메일 형식이 아닙니다.`;
};
