import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class WordFormDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  partOfSpeech: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  form: string;

  @IsString()
  @MaxLength(200)
  meaning: string;
}
