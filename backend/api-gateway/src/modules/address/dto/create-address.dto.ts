import { IsString, IsOptional, IsBoolean, Length } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsString()
  phone: string;

  @IsString()
  province: string;

  @IsString()
  city: string;

  @IsString()
  district: string;

  @IsString()
  @Length(1, 255)
  detail: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
