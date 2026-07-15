import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Conteudo } from './entities/conteudo.entity';
import { CreateConteudoDto } from './dto/create-conteudo.dto';
import { UpdateConteudoDto } from './dto/update-conteudo.dto';

@Injectable()
export class ConteudosService {
  constructor(
    @InjectRepository(Conteudo)
    private readonly conteudoRepository: Repository<Conteudo>,
  ) {}

  async criar(createConteudoDto: CreateConteudoDto): Promise<Conteudo> {
    const conteudo = this.conteudoRepository.create(createConteudoDto);
    return this.conteudoRepository.save(conteudo);
  }

  async listar(categoria?: string): Promise<Conteudo[]> {
    const where = categoria ? { categoria } : {};

    return this.conteudoRepository.find({
      where,
      order: {
        ordem: 'ASC',
        id: 'ASC',
      },
    });
  }

  async buscarPorId(id: number): Promise<Conteudo> {
    const conteudo = await this.conteudoRepository.findOne({
      where: { id },
    });

    if (!conteudo) {
      throw new NotFoundException('Conteúdo não encontrado.');
    }

    return conteudo;
  }

  async atualizar(
    id: number,
    updateConteudoDto: UpdateConteudoDto,
  ): Promise<Conteudo> {
    const conteudo = await this.buscarPorId(id);

    Object.assign(conteudo, updateConteudoDto);

    return this.conteudoRepository.save(conteudo);
  }

  async remover(id: number): Promise<{ mensagem: string }> {
    const conteudo = await this.buscarPorId(id);

    await this.conteudoRepository.remove(conteudo);

    return {
      mensagem: 'Conteúdo removido com sucesso.',
    };
  }
}
