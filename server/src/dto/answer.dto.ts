import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class AnswerDto {
  @IsUUID()
  sessionId: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  questionIndex: number;

  @IsString()
  @IsNotEmpty()
  answer: string;
}
