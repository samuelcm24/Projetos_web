import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { UsuariosService } from '../usuarios/usuarios.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsuariosService = {
    criar: jest.fn(),
    buscarPorEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuariosService,
          useValue: mockUsuariosService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve cadastrar um usuário', async () => {
    mockUsuariosService.criar.mockResolvedValue({
      id: 1,
      nome: 'Admin',
      email: 'admin@email.com',
      senha: 'senhaCriptografada',
    });

    const resultado = await service.register({
      nome: 'Admin',
      email: 'admin@email.com',
      senha: '123456',
    });

    expect(resultado.mensagem).toBe('Usuário cadastrado com sucesso.');
    expect(resultado.usuario.email).toBe('admin@email.com');
    expect(resultado.usuario).not.toHaveProperty('senha');
  });

  it('deve fazer login e retornar token', async () => {
    const senhaCriptografada = await bcrypt.hash('123456', 10);

    mockUsuariosService.buscarPorEmail.mockResolvedValue({
      id: 1,
      nome: 'Admin',
      email: 'admin@email.com',
      senha: senhaCriptografada,
    });

    mockJwtService.sign.mockReturnValue('token_jwt_teste');

    const resultado = await service.login({
      email: 'admin@email.com',
      senha: '123456',
    });

    expect(resultado.access_token).toBe('token_jwt_teste');
    expect(resultado.usuario.email).toBe('admin@email.com');
  });

  it('deve negar login com e-mail inexistente', async () => {
    mockUsuariosService.buscarPorEmail.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'inexistente@email.com',
        senha: '123456',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('deve negar login com senha incorreta', async () => {
    const senhaCriptografada = await bcrypt.hash('123456', 10);

    mockUsuariosService.buscarPorEmail.mockResolvedValue({
      id: 1,
      nome: 'Admin',
      email: 'admin@email.com',
      senha: senhaCriptografada,
    });

    await expect(
      service.login({
        email: 'admin@email.com',
        senha: 'senhaerrada',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
