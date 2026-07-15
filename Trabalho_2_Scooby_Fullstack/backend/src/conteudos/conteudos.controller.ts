import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConteudosService } from './conteudos.service';
import { CreateConteudoDto } from './dto/create-conteudo.dto';
import { UpdateConteudoDto } from './dto/update-conteudo.dto';

@UseGuards(JwtAuthGuard)
@Controller('conteudos')
export class ConteudosController {
  constructor(private readonly conteudosService: ConteudosService) {}

  @Post()
  criar(@Body() createConteudoDto: CreateConteudoDto) {
    return this.conteudosService.criar(createConteudoDto);
  }

  @Get()
  listar(@Query('categoria') categoria?: string) {
    return this.conteudosService.listar(categoria);
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.conteudosService.buscarPorId(Number(id));
  }

  @Patch(':id')
  atualizar(
    @Param('id') id: string,
    @Body() updateConteudoDto: UpdateConteudoDto,
  ) {
    return this.conteudosService.atualizar(Number(id), updateConteudoDto);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.conteudosService.remover(Number(id));
  }
}
