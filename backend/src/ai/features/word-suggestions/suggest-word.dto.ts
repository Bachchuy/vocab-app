import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SuggestWordDto {
  @IsString() @IsNotEmpty() @MaxLength(100)
  english: string;

  @IsOptional() @IsString() @MaxLength(200)
  meaning?: string;

  @IsOptional() @IsString() @MaxLength(500)
  source?: string;
}
