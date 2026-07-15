import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve cadastrar usuário', async () => {
    mockAuthService.register.mockResolvedValue({
      mensagem: 'Usuário cadastrado com sucesso.',
      usuario: {
        id: 1,
        nome: 'Admin',
        email: 'admin@email.com',
      },
    });

    const resultado = await controller.register({
      nome: 'Admin',
      email: 'admin@email.com',
      senha: '123456',
    });

    expect(resultado.mensagem).toBe('Usuário cadastrado com sucesso.');
    expect(resultado.usuario.email).toBe('admin@email.com');
  });

  it('deve fazer login', async () => {
    mockAuthService.login.mockResolvedValue({
      access_token: 'token_jwt_teste',
      usuario: {
        id: 1,
        nome: 'Admin',
        email: 'admin@email.com',
      },
    });

    const resultado = await controller.login({
      email: 'admin@email.com',
      senha: '123456',
    });

    expect(resultado.access_token).toBe('token_jwt_teste');
    expect(resultado.usuario.email).toBe('admin@email.com');
  });
});
