import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../services/productService.js');

import productsService from '../../services/productService.js';
import {
    getProdutos,
    getProdutoPorId,
    getProdutosCancelados,
    criarProduto,
    atualizarProduto,
    deletarProduto,
    reativarProduto
} from '../../controllers/productsController.js';

describe('Products Controller', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            params: {},
            body: {}
        };
        res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
            json: vi.fn()
        };
        vi.clearAllMocks();
    });

    describe('getProdutos', () => {
        it('deve retornar status 200 e a lista de produtos ativos', () => {
            const mockList = [{ id: 1, nome: 'Produto A', ativo: true }];
            productsService.listarTodos.mockReturnValue(mockList);

            getProdutos(req, res);

            expect(productsService.listarTodos).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockList);
        });

        it('deve retornar status de erro correspondente se falhar', () => {
            const error = new Error('Falha no banco');
            error.statusCode = 500;
            productsService.listarTodos.mockImplementation(() => {
                throw error;
            });

            getProdutos(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Falha no banco' });
        });
    });

    describe('getProdutoPorId', () => {
        it('deve retornar o produto se encontrado', () => {
            req.params.id = '1';
            const mockProduct = { id: 1, nome: 'Produto A' };
            productsService.buscarPorId.mockReturnValue(mockProduct);

            getProdutoPorId(req, res);

            expect(productsService.buscarPorId).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProduct);
        });
    });

    describe('getProdutosCancelados', () => {
        it('deve retornar a lista de produtos cancelados', () => {
            const mockList = [{ id: 2, nome: 'Produto B', ativo: false }];
            productsService.listarCancelados.mockReturnValue(mockList);

            getProdutosCancelados(req, res);

            expect(productsService.listarCancelados).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockList);
        });
    });

    describe('criarProduto', () => {
        it('deve retornar 201 e o produto criado', () => {
            req.body = { nome: 'Produto Novo' };
            const mockProduct = { id: 3, nome: 'Produto Novo' };
            productsService.criar.mockReturnValue(mockProduct);

            criarProduto(req, res);

            expect(productsService.criar).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith(mockProduct);
        });
    });

    describe('atualizarProduto', () => {
        it('deve retornar 200 e o produto atualizado', () => {
            req.params.id = '1';
            req.body = { nome: 'Produto A Editado' };
            const mockProduct = { id: 1, nome: 'Produto A Editado' };
            productsService.atualizar.mockReturnValue(mockProduct);

            atualizarProduto(req, res);

            expect(productsService.atualizar).toHaveBeenCalledWith('1', req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProduct);
        });
    });

    describe('deletarProduto', () => {
        it('deve retornar 200 e mensagem de sucesso', () => {
            req.params.id = '1';
            const mockResponse = { mensagem: 'Produto desativado com sucesso!' };
            productsService.deletar.mockReturnValue(mockResponse);

            deletarProduto(req, res);

            expect(productsService.deletar).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockResponse);
        });
    });

    describe('reativarProduto', () => {
        it('deve retornar 200 e o produto reativado', () => {
            req.params.id = '2';
            req.body = { nome: 'Produto B' };
            const mockProduct = { id: 2, nome: 'Produto B', ativo: true };
            productsService.reativar.mockReturnValue(mockProduct);

            reativarProduto(req, res);

            expect(productsService.reativar).toHaveBeenCalledWith('2', 'Produto B');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProduct);
        });
    });
});
