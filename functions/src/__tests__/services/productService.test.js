import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductService } from '../../services/productService.js';
import { ProductAlreadyExists, ProductNotFound } from '../../utils/exceptions.js';

describe('ProductService', () => {
    let productService;
    let mockProductRepository;

    beforeEach(() => {
        mockProductRepository = {
            findByName: vi.fn(),
            create: vi.fn(),
            findAll: vi.fn(),
            findById: vi.fn(),
            findByCategoryId: vi.fn(),
            findByBrand: vi.fn(),
            update: vi.fn(),
            addAttribute: vi.fn(),
            removeAttribute: vi.fn(),
            deleteById: vi.fn()
        };

        productService = new ProductService(mockProductRepository);
    });

    describe('create', () => {
        it('deve criar um produto com sucesso', async () => {
            const productData = {
                name: 'Notebook Gamer',
                currentPrice: 4500,
                originalPrice: 5000,
                discount: 10,
                image: 'notebook.jpg',
                categoryId: 'electronics',
                description: 'Notebook top',
                stock: 10,
                brand: 'Dell'
            };

            mockProductRepository.findByName.mockResolvedValue(null);
            mockProductRepository.create.mockResolvedValue({ id: 'uuid-123', ...productData, active: true, attributes: [] });

            const result = await productService.create(productData);

            expect(mockProductRepository.findByName).toHaveBeenCalledWith('Notebook Gamer');
            expect(mockProductRepository.create).toHaveBeenCalled();
            expect(result.id).toBe('uuid-123');
            expect(result.name).toBe('Notebook Gamer');
        });

        it('deve lancar ProductAlreadyExists se o nome ja existir', async () => {
            const productData = { name: 'Notebook Gamer' };
            mockProductRepository.findByName.mockResolvedValue({ id: 'uuid-123', name: 'Notebook Gamer' });

            await expect(productService.create(productData)).rejects.toThrow(ProductAlreadyExists);
            expect(mockProductRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('deve retornar todos os produtos', async () => {
            const mockProducts = [{ id: '1', name: 'P1' }, { id: '2', name: 'P2' }];
            mockProductRepository.findAll.mockResolvedValue(mockProducts);

            const result = await productService.findAll();

            expect(mockProductRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockProducts);
        });
    });

    describe('findById', () => {
        it('deve retornar o produto se encontrado', async () => {
            const mockProduct = { id: '1', name: 'P1' };
            mockProductRepository.findById.mockResolvedValue(mockProduct);

            const result = await productService.findById('1');

            expect(mockProductRepository.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockProduct);
        });

        it('deve lancar ProductNotFound se nao encontrado', async () => {
            mockProductRepository.findById.mockResolvedValue(null);

            await expect(productService.findById('1')).rejects.toThrow(ProductNotFound);
        });
    });

    describe('findByCategoryId', () => {
        it('deve retornar produtos da categoria', async () => {
            const mockProducts = [{ id: '1', name: 'P1', categoryId: 'cat1' }];
            mockProductRepository.findByCategoryId.mockResolvedValue(mockProducts);

            const result = await productService.findByCategoryId('cat1');

            expect(mockProductRepository.findByCategoryId).toHaveBeenCalledWith('cat1');
            expect(result).toEqual(mockProducts);
        });

        it('deve lancar ProductNotFound se nenhum produto for encontrado', async () => {
            mockProductRepository.findByCategoryId.mockResolvedValue([]);

            await expect(productService.findByCategoryId('cat1')).rejects.toThrow(ProductNotFound);
        });
    });

    describe('findByBrand', () => {
        it('deve retornar produtos da marca', async () => {
            const mockProducts = [{ id: '1', name: 'P1', brand: 'Dell' }];
            mockProductRepository.findByBrand.mockResolvedValue(mockProducts);

            const result = await productService.findByBrand('Dell');

            expect(mockProductRepository.findByBrand).toHaveBeenCalledWith('Dell');
            expect(result).toEqual(mockProducts);
        });

        it('deve lancar ProductNotFound se nenhum produto for encontrado', async () => {
            mockProductRepository.findByBrand.mockResolvedValue([]);

            await expect(productService.findByBrand('Dell')).rejects.toThrow(ProductNotFound);
        });
    });

    describe('update', () => {
        it('deve atualizar o produto se encontrado', async () => {
            const mockProduct = { id: '1', name: 'P1' };
            const updateData = { name: 'P1 Atualizado' };
            mockProductRepository.findById.mockResolvedValue(mockProduct);
            mockProductRepository.update.mockResolvedValue({ ...mockProduct, ...updateData });

            const result = await productService.update('1', updateData);

            expect(mockProductRepository.findById).toHaveBeenCalledWith('1');
            expect(mockProductRepository.update).toHaveBeenCalledWith('1', updateData);
            expect(result.name).toBe('P1 Atualizado');
        });

        it('deve lancar ProductNotFound se o produto nao existir', async () => {
            mockProductRepository.findById.mockResolvedValue(null);

            await expect(productService.update('1', {})).rejects.toThrow(ProductNotFound);
            expect(mockProductRepository.update).not.toHaveBeenCalled();
        });
    });

    describe('addAttribute', () => {
        it('deve adicionar um atributo se o produto existir', async () => {
            const mockProduct = { id: '1', name: 'P1', attributes: [] };
            const attr = { title: 'Cor', paragraph: 'Preto' };
            mockProductRepository.findById.mockResolvedValue(mockProduct);
            mockProductRepository.addAttribute.mockResolvedValue({ ...mockProduct, attributes: [attr] });

            const result = await productService.addAttribute('1', attr);

            expect(mockProductRepository.findById).toHaveBeenCalledWith('1');
            expect(mockProductRepository.addAttribute).toHaveBeenCalledWith('1', attr);
            expect(result.attributes).toContainEqual(attr);
        });

        it('deve lancar ProductNotFound se o produto nao existir', async () => {
            mockProductRepository.findById.mockResolvedValue(null);

            await expect(productService.addAttribute('1', {})).rejects.toThrow(ProductNotFound);
            expect(mockProductRepository.addAttribute).not.toHaveBeenCalled();
        });
    });

    describe('removeAttribute', () => {
        it('deve remover o atributo se o produto existir', async () => {
            const attr = { title: 'Cor', paragraph: 'Preto' };
            const mockProduct = { id: '1', name: 'P1', attributes: [attr] };
            mockProductRepository.findById.mockResolvedValue(mockProduct);
            mockProductRepository.removeAttribute.mockResolvedValue({ ...mockProduct, attributes: [] });

            const result = await productService.removeAttribute('1', 'Cor');

            expect(mockProductRepository.findById).toHaveBeenCalledWith('1');
            expect(mockProductRepository.removeAttribute).toHaveBeenCalledWith('1', 'Cor');
            expect(result.attributes).toHaveLength(0);
        });

        it('deve lancar ProductNotFound se o produto nao existir', async () => {
            mockProductRepository.findById.mockResolvedValue(null);

            await expect(productService.removeAttribute('1', 'Cor')).rejects.toThrow(ProductNotFound);
            expect(mockProductRepository.removeAttribute).not.toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('deve deletar o produto se ele existir', async () => {
            const mockProduct = { id: '1', name: 'P1' };
            mockProductRepository.findById.mockResolvedValue(mockProduct);

            await productService.delete('1');

            expect(mockProductRepository.findById).toHaveBeenCalledWith('1');
            expect(mockProductRepository.deleteById).toHaveBeenCalledWith('1');
        });

        it('deve lancar ProductNotFound se o produto nao existir', async () => {
            mockProductRepository.findById.mockResolvedValue(null);

            await expect(productService.delete('1')).rejects.toThrow(ProductNotFound);
            expect(mockProductRepository.deleteById).not.toHaveBeenCalled();
        });
    });
});
