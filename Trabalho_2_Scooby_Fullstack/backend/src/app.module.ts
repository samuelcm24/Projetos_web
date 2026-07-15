import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ConteudosModule } from './conteudos/conteudos.module';

import { Usuario } from './usuarios/entities/usuario.entity';
import { Conteudo } from './conteudos/entities/conteudo.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Usuario, Conteudo],
      synchronize: true,
    }),

    UsuariosModule,
    AuthModule,
    ConteudosModule,
  ],
})
export class AppModule {}
