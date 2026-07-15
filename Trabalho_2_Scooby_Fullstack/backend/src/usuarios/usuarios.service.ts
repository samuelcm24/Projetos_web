import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async criar(nome: string, email: string, senha: string): Promise<Usuario> {
    const usuarioExistente = await this.buscarPorEmail(email);

    if (usuarioExistente) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = this.usuarioRepository.create({
      nome,
      email,
      senha: senhaCriptografada,
    });

    return this.usuarioRepository.save(usuario);
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: { email },
    });
  }
}
