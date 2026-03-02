import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export class StartQuizDto {
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  amount: number = 10;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  category?: number;

  @IsEnum(['easy', 'medium', 'hard'])
  @IsOptional()
  difficulty?: 'easy' | 'medium' | 'hard';

  @IsEnum(['multiple', 'boolean'])
  @IsOptional()
  type?: 'multiple' | 'boolean';
}
