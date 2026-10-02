import { ArrayMaxSize, IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class VocabularySenseDto {
  @IsString() @MaxLength(300)
  definition: string;

  @IsOptional() @IsString() @MaxLength(300)
  translation?: string;

  @IsOptional() @IsArray() @ArrayMaxSize(5) @IsString({ each: true })
  examples?: string[];

  @IsOptional() @IsString() @MaxLength(300)
  usageNotes?: string;
}