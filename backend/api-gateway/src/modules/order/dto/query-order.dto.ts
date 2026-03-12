import { IsOptional, IsIn } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto.js';

export class QueryOrderDto extends PaginationDto {
  @IsOptional()
  @IsIn(['pending', 'paid', 'shipped', 'completed', 'cancelled'])
  status?: string;
}
