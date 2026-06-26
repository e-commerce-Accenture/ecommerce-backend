import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CategoryService } from '../../services/categoryService.js';
import { CategoryAlreadyExists, CategoryNotFound } from '../../utils/exceptions.js';

describe('CategoryService', () => {

    let categoryService;
    let mockCategoryRepository;

    beforeEach(() => {
        mockCategoryRepository = {
            findByName: vi.fn(),
            findById: vi.fn(),
            findAll: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            deleteById: vi.fn()
        };

        categoryService = new CategoryService(mockCategoryRepository);
    });

    // CENÁRIO 1: Criar categoria com sucesso
    
    it('Cria uma categoria com sucesso quando o nome não existe', async () => {
        // Nome ainda não existe no banco
        mockCategoryRepository.findByName.mockResolvedValue(null);
        mockCategoryRepository.create.mockResolvedValue({
            id: 'cat-uuid',
            name: 'Eletrônicos',
            imgUrl: 'imagem eletrônica'
        });

        const result = await categoryService.create('Eletrônicos', 'imagem eletrônica');

        expect(result.name).toBe('Eletrônicos');
        expect(result).toHaveProperty('id');
        expect(mockCategoryRepository.create).toHaveBeenCalledOnce();
    });

    // CENÁRIO 2: Criar categoria com nome duplicado
    
    it('Lança CategoryAlreadyExists quando o nome já está cadastrado', async () => {
        // Nome já existe no banco
        mockCategoryRepository.findByName.mockResolvedValue({
            id: 'cat-existente',
            name: 'Eletrônicos'
        });

        await expect(
            categoryService.create('Eletrônicos', 'imagem eletrônica')
        ).rejects.toThrow(CategoryAlreadyExists);

        // create nunca deve ser chamado se o nome já existe
        expect(mockCategoryRepository.create).not.toHaveBeenCalled();
    });

    // CENÁRIO 3: Buscar categoria por ID inexistente
    
    it('Lança CategoryNotFound quando a categoria não existe', async () => {
        mockCategoryRepository.findById.mockResolvedValue(null);

        await expect(
            categoryService.findById('id-inexistente')
        ).rejects.toThrow(CategoryNotFound);
    });

    // CENÁRIO 4: Deletar categoria inexistente
    
    it('Lança CategoryNotFound ao tentar deletar categoria inexistente', async () => {
        mockCategoryRepository.findById.mockResolvedValue(null);

        await expect(
            categoryService.delete('id-inexistente')
        ).rejects.toThrow(CategoryNotFound);

        // deleteById nunca deve ser chamado
        expect(mockCategoryRepository.deleteById).not.toHaveBeenCalled();
    });

    // CENÁRIO 5: Listar todas as categorias

    it('Retorna todas as categorias corretamente', async () => {
        mockCategoryRepository.findAll.mockResolvedValue([
            { id: 'cat-1', name: 'Eletrônicos', imgUrl: 'url1' },
            { id: 'cat-2', name: 'Roupas', imgUrl: 'url2' }
        ]);

        const result = await categoryService.findAll();

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Eletrônicos');
        expect(result[1].name).toBe('Roupas');
    });

});
