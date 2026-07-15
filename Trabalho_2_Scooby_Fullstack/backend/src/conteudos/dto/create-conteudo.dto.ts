import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConteudoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  texto: string;

  @IsString()
  @IsNotEmpty()
  imagem: string;

  @IsNumber()
  ordem: number;

  @IsString()
  @IsNotEmpty()
  categoria: string;
}
