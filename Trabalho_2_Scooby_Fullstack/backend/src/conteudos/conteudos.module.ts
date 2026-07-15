import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConteudosController } from './conteudos.controller';
import { ConteudosService } from './conteudos.service';
import { Conteudo } from './entities/conteudo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conteudo])],
  controllers: [ConteudosController],
  providers: [ConteudosService],
})
export class ConteudosModule {}
