import { Test, TestingModule } from '@nestjs/testing';

import { ConteudosController } from './conteudos.controller';
import { ConteudosService } from './conteudos.service';

describe('ConteudosController', () => {
  let controller: ConteudosController;

  const mockConteudosService = {
    criar: jest.fn(),
    listar: jest.fn(),
    buscarPorId: jest.fn(),
    atualizar: jest.fn(),
    remover: jest.fn(),
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
      controllers: [ConteudosController],
      providers: [
        {
          provide: ConteudosService,
          useValue: mockConteudosService,
        },
      ],
    }).compile();

    controller = module.get<ConteudosController>(ConteudosController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve criar conteúdo', async () => {
    mockConteudosService.criar.mockResolvedValue(conteudoMock);

    const resultado = await controller.criar({
      titulo: 'Temporada 1',
      texto: 'Texto da temporada',
      imagem: 'Imagens/capa_primeira_temp.jpeg',
      ordem: 1,
      categoria: 'temporada',
    });

    expect(resultado).toEqual(conteudoMock);
  });

  it('deve listar conteúdos', async () => {
    mockConteudosService.listar.mockResolvedValue([conteudoMock]);

    const resultado = await controller.listar('temporada');

    expect(resultado).toEqual([conteudoMock]);
    expect(mockConteudosService.listar).toHaveBeenCalledWith('temporada');
  });

  it('deve buscar conteúdo por ID', async () => {
    mockConteudosService.buscarPorId.mockResolvedValue(conteudoMock);

    const resultado = await controller.buscarPorId('1');

    expect(resultado).toEqual(conteudoMock);
    expect(mockConteudosService.buscarPorId).toHaveBeenCalledWith(1);
  });

  it('deve atualizar conteúdo', async () => {
    mockConteudosService.atualizar.mockResolvedValue({
      ...conteudoMock,
      titulo: 'Atualizado',
    });

    const resultado = await controller.atualizar('1', {
      titulo: 'Atualizado',
    });

    expect(resultado.titulo).toBe('Atualizado');
  });

  it('deve remover conteúdo', async () => {
    mockConteudosService.remover.mockResolvedValue({
      mensagem: 'Conteúdo removido com sucesso.',
    });

    const resultado = await controller.remover('1');

    expect(resultado).toEqual({
      mensagem: 'Conteúdo removido com sucesso.',
    });
  });
});
