import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ConteudosService } from './conteudos.service';
import { Conteudo } from './entities/conteudo.entity';

describe('ConteudosService', () => {
  let service: ConteudosService;

  const mockConteudoRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const conteudoMock = {
    id: 1,
    titulo: 'Temporada 1',
    texto: 'Texto da temporada',
    imagem: 'Imagens/capa_primeira_temp.jpeg',
    ordem: 1,
    categoria: 'temporada',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConteudosService,
        {
          provide: getRepositoryToken(Conteudo),
          useValue: mockConteudoRepository,
        },
      ],
    }).compile();

    service = module.get<ConteudosService>(ConteudosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve criar um conteúdo', async () => {
    mockConteudoRepository.create.mockReturnValue(conteudoMock);
    mockConteudoRepository.save.mockResolvedValue(conteudoMock);

    const resultado = await service.criar({
      titulo: 'Temporada 1',
      texto: 'Texto da temporada',
      imagem: 'Imagens/capa_primeira_temp.jpeg',
      ordem: 1,
      categoria: 'temporada',
    });

    expect(resultado).toEqual(conteudoMock);
    expect(mockConteudoRepository.create).toHaveBeenCalled();
    expect(mockConteudoRepository.save).toHaveBeenCalledWith(conteudoMock);
  });

  it('deve listar conteúdos ordenados', async () => {
    mockConteudoRepository.find.mockResolvedValue([conteudoMock]);

    const resultado = await service.listar('temporada');

    expect(resultado).toEqual([conteudoMock]);
    expect(mockConteudoRepository.find).toHaveBeenCalledWith({
      where: { categoria: 'temporada' },
      order: {
        ordem: 'ASC',
        id: 'ASC',
      },
    });
  });

  it('deve buscar conteúdo por ID', async () => {
    mockConteudoRepository.findOne.mockResolvedValue(conteudoMock);

    const resultado = await service.buscarPorId(1);

    expect(resultado).toEqual(conteudoMock);
    expect(mockConteudoRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('deve lançar erro se conteúdo não existir', async () => {
    mockConteudoRepository.findOne.mockResolvedValue(null);

    await expect(service.buscarPorId(999)).rejects.toThrow(NotFoundException);
  });

  it('deve atualizar um conteúdo', async () => {
    mockConteudoRepository.findOne.mockResolvedValue({ ...conteudoMock });
    mockConteudoRepository.save.mockResolvedValue({
      ...conteudoMock,
      titulo: 'Temporada Atualizada',
    });

    const resultado = await service.atualizar(1, {
      titulo: 'Temporada Atualizada',
    });

    expect(resultado.titulo).toBe('Temporada Atualizada');
    expect(mockConteudoRepository.save).toHaveBeenCalled();
  });

  it('deve remover um conteúdo', async () => {
    mockConteudoRepository.findOne.mockResolvedValue(conteudoMock);
    mockConteudoRepository.remove.mockResolvedValue(conteudoMock);

    const resultado = await service.remover(1);

    expect(resultado).toEqual({
      mensagem: 'Conteúdo removido com sucesso.',
    });

    expect(mockConteudoRepository.remove).toHaveBeenCalledWith(conteudoMock);
  });
});
