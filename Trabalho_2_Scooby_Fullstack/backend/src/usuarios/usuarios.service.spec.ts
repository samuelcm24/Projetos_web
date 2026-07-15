import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Usuario } from './entities/usuario.entity';
import { UsuariosService } from './usuarios.service';

describe('UsuariosService', () => {
  let service: UsuariosService;

  const mockUsuarioRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const usuarioMock = {
    id: 1,
    nome: 'Admin',
    email: 'admin@email.com',
    senha: 'senhaCriptografada',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepository,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve buscar usuário por e-mail', async () => {
    mockUsuarioRepository.findOne.mockResolvedValue(usuarioMock);

    const resultado = await service.buscarPorEmail('admin@email.com');

    expect(resultado).toEqual(usuarioMock);
    expect(mockUsuarioRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'admin@email.com' },
    });
  });

  it('deve criar usuário com senha criptografada', async () => {
    mockUsuarioRepository.findOne.mockResolvedValue(null);

    mockUsuarioRepository.create.mockImplementation((dados) => ({
      id: 1,
      ...dados,
    }));

    mockUsuarioRepository.save.mockImplementation((usuario) =>
      Promise.resolve(usuario),
    );

    const resultado = await service.criar('Admin', 'admin@email.com', '123456');

    expect(resultado.email).toBe('admin@email.com');
    expect(resultado.senha).not.toBe('123456');
    expect(mockUsuarioRepository.create).toHaveBeenCalled();
    expect(mockUsuarioRepository.save).toHaveBeenCalled();
  });

  it('deve impedir cadastro com e-mail repetido', async () => {
    mockUsuarioRepository.findOne.mockResolvedValue(usuarioMock);

    await expect(
      service.criar('Admin', 'admin@email.com', '123456'),
    ).rejects.toThrow(ConflictException);
  });
});
