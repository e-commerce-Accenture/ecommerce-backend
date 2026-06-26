import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductController } from '../../controllers/productsController.js';
import { ProductService } from '../../services/productService.js';

vi.mock('../../services/productService.js');

describe('ProductController', () => {
    let req;
    let res;
    let next;
    let controller;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            validated: {
                body: {}
            }
        };
        res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
            json: vi.fn()
        };
        next = vi.fn();
        controller = new ProductController();
        vi.clearAllMocks();
    });

    describe('createProduct', () => {
        it('deve retornar status 200 e o produto criado em caso de sucesso', async () => {
            const productData = { name: 'P1', currentPrice: 10, originalPrice: 12, discount: 2, image: 'img', categoryId: 'cat', description: 'desc', stock: 5, brand: 'brand' };
            req.validated.body = productData;
            ProductService.prototype.create.mockResolvedValue({ id: 'uuid-123', ...productData });

            await controller.createProduct(req, res, next);

            expect(ProductService.prototype.create).toHaveBeenCalledWith(productData);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: 'uuid-123', ...productData });
            expect(next).not.toHaveBeenCalled();
        });

        it('deve chamar next(error) em caso de falha', async () => {
            const error = new Error('Falha');
            ProductService.prototype.create.mockRejectedValue(error);

            await controller.createProduct(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getProducts', () => {
        it('deve retornar 200 e todos os produtos', async () => {
            const mockList = [{ id: '1', name: 'P1' }];
            ProductService.prototype.findAll.mockResolvedValue(mockList);

            await controller.getProducts(req, res, next);

            expect(ProductService.prototype.findAll).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockList);
        });

        it('deve chamar next(error) em caso de falha', async () => {
            const error = new Error('Falha');
            ProductService.prototype.findAll.mockRejectedValue(error);

            await controller.getProducts(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getProductById', () => {
        it('deve retornar 200 e o produto encontrado', async () => {
            req.params.id = '1';
            const mockProduct = { id: '1', name: 'P1' };
            ProductService.prototype.findById.mockResolvedValue(mockProduct);

            await controller.getProductById(req, res, next);

            expect(ProductService.prototype.findById).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProduct);
        });

        it('deve chamar next(error) em caso de falha', async () => {
            req.params.id = '1';
            const error = new Error('Falha');
            ProductService.prototype.findById.mockRejectedValue(error);

            await controller.getProductById(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getProductsByCategory', () => {
        it('deve retornar 200 e produtos por categoria', async () => {
            req.params.categoryId = 'cat-123';
            const mockList = [{ id: '1', name: 'P1', categoryId: 'cat-123' }];
            ProductService.prototype.findByCategoryId.mockResolvedValue(mockList);

            await controller.getProductsByCategory(req, res, next);

            expect(ProductService.prototype.findByCategoryId).toHaveBeenCalledWith('cat-123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockList);
        });

        it('deve chamar next(error) em caso de falha', async () => {
            req.params.categoryId = 'cat-123';
            const error = new Error('Falha');
            ProductService.prototype.findByCategoryId.mockRejectedValue(error);

            await controller.getProductsByCategory(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getProductsByBrand', () => {
        it('deve retornar 200 e produtos por marca', async () => {
            req.params.brand = 'Dell';
            const mockList = [{ id: '1', name: 'P1', brand: 'Dell' }];
            ProductService.prototype.findByBrand.mockResolvedValue(mockList);

            await controller.getProductsByBrand(req, res, next);

            expect(ProductService.prototype.findByBrand).toHaveBeenCalledWith('Dell');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockList);
        });

        it('deve chamar next(error) em caso de falha', async () => {
            req.params.brand = 'Dell';
            const error = new Error('Falha');
            ProductService.prototype.findByBrand.mockRejectedValue(error);

            await controller.getProductsByBrand(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('updateProduct', () => {
        it('deve retornar 200 e o produto atualizado', async () => {
            req.params.id = '1';
            const updateData = { name: 'P1 Atualizado' };
            req.validated.body = updateData;
            ProductService.prototype.update.mockResolvedValue({ id: '1', name: 'P1 Atualizado' });

            await controller.updateProduct(req, res, next);

            expect(ProductService.prototype.update).toHaveBeenCalledWith('1', updateData);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: '1', name: 'P1 Atualizado' });
        });

        it('deve chamar next(error) em caso de falha', async () => {
            req.params.id = '1';
            const error = new Error('Falha');
            ProductService.prototype.update.mockRejectedValue(error);

            await controller.updateProduct(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('addAttribute', () => {
        it('deve retornar 200 e o produto com novo atributo', async () => {
            req.params.id = '1';
            const attr = { title: 'Cor', paragraph: 'Preto' };
            req.validated.body = attr;
            ProductService.prototype.addAttribute.mockResolvedValue({ id: '1', attributes: [attr] });

            await controller.addAttribute(req, res, next);

            expect(ProductService.prototype.addAttribute).toHaveBeenCalledWith('1', attr);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: '1', attributes: [attr] });
        });

        it('deve chamar next(error) em caso de falha', async () => {
            req.params.id = '1';
            const error = new Error('Falha');
            ProductService.prototype.addAttribute.mockRejectedValue(error);

            await controller.addAttribute(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('removeAttribute', () => {
        it('deve retornar 200 e o produto atualizado', async () => {
            req.params.id = '1';
            req.params.title = 'Cor';
            ProductService.prototype.removeAttribute.mockResolvedValue({ id: '1', attributes: [] });

            await controller.removeAttribute(req, res, next);

            expect(ProductService.prototype.removeAttribute).toHaveBeenCalledWith('1', 'Cor');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: '1', attributes: [] });
        });

        it('deve chamar next(error) em caso de falha', async () => {
            req.params.id = '1';
            req.params.title = 'Cor';
            const error = new Error('Falha');
            ProductService.prototype.removeAttribute.mockRejectedValue(error);

            await controller.removeAttribute(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteProduct', () => {
        it('deve retornar status 204 em caso de sucesso', async () => {
            req.params.id = '1';
            ProductService.prototype.delete.mockResolvedValue(undefined);

            await controller.deleteProduct(req, res, next);

            expect(ProductService.prototype.delete).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('deve chamar next(error) em caso de falha', async () => {
            req.params.id = '1';
            const error = new Error('Falha');
            ProductService.prototype.delete.mockRejectedValue(error);

            await controller.deleteProduct(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
