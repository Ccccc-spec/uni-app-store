import { IsString, IsOptional, Length, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入正确的手机号' })
  phone: string;

  @IsString()
  @Length(6, 20, { message: '密码长度为6-20位' })
  password: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  nickname?: string;
}
