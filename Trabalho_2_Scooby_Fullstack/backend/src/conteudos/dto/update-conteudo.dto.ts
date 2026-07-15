import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateConteudoDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  texto?: string;

  @IsString()
  @IsOptional()
  imagem?: string;

  @IsNumber()
  @IsOptional()
  ordem?: number;

  @IsString()
  @IsOptional()
  categoria?: string;
}
