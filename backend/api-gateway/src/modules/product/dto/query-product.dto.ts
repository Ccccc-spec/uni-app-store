import { IsOptional, IsString, IsInt, IsIn } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto.js';

export class QueryProductDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  category?: number;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsIn(['price_asc', 'price_desc', 'sales_desc', 'newest'])
  sort?: string;
}
