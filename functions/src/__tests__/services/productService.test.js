import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('fs');

import fs from 'fs';
import productService from '../../services/productService.js';

const produtoValido = {
    nome: 'Notebook Gamer',
    precoAtual: 3500,
    precoOriginal: 4000,
    desconto: 12,
    imagem: 'notebook.jpg',
    categoria: 'Eletrônicos',
    estoque: 10,
    marca: 'Dell'
};

const produtosMock = [
    {
        id: 1,
        nome: 'Notebook Gamer',
        precoAtual: 3500,
        precoOriginal: 4000,
        desconto: 12,
        imagem: 'notebook.jpg',
        categoria: 'Eletrônicos',
        estoque: 10,
        marca: 'Dell',
        ativo: true
    },
    {
        id: 2,
        nome: 'Mouse sem fio',
        precoAtual: 80,
        precoOriginal: 100,
        desconto: 20,
        imagem: 'mouse.jpg',
        categoria: 'Periféricos',
        estoque: 50,
        marca: 'Logitech',
        ativo: false
    }
];

describe('productService', () => {

    beforeEach(() => {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(JSON.stringify(produtosMock));
        fs.writeFileSync.mockImplementation(() => { });
    });

    it('listarTodos retorna apenas produtos com ativo === true', () => {
        const result = productService.listarTodos();

        expect(result).toHaveLength(1);
        expect(result[0].nome).toBe('Notebook Gamer');
        expect(result[0].ativo).toBe(true);
    });

    it('listarCancelados retorna apenas produtos com ativo === false', () => {
        const result = productService.listarCancelados();

        expect(result).toHaveLength(1);
        expect(result[0].nome).toBe('Mouse sem fio');
        expect(result[0].ativo).toBe(false);
    });

    it('buscarPorId retorna o produto correto quando o ID existe e está ativo', () => {
        const result = productService.buscarPorId(1);

        expect(result.id).toBe(1);
        expect(result.nome).toBe('Notebook Gamer');
    });

    it('buscarPorId lança erro quando o ID não é numérico', () => {
        expect(() => productService.buscarPorId('abc')).toThrow('O id do produto deve ser numerico.');
    });

    it('criar lança erro quando precoAtual é maior que precoOriginal', () => {
        const produtoInvalido = {
            ...produtoValido,
            nome: 'Produto Invalido',
            precoAtual: 5000,
            precoOriginal: 3000
        };

        expect(() => productService.criar(produtoInvalido))
            .toThrow('O campo precoAtual nao pode ser maior que precoOriginal.');
    });

    it('criar lança erro quando já existe produto ativo com o mesmo nome', () => {
        expect(() => productService.criar(produtoValido))
            .toThrow('Ja existe um produto ativo com esse nome.');
    });

    it('criar lança erro quando o nome tem menos de 2 caracteres', () => {
        const produtoInvalido = { ...produtoValido, nome: 'A' };

        expect(() => productService.criar(produtoInvalido))
            .toThrow('O campo nome deve ter entre 2 e 100 caracteres.');
    });

    it('criar lança erro quando o desconto é maior que 100', () => {
        const produtoInvalido = { ...produtoValido, nome: 'Produto Novo', desconto: 150 };

        expect(() => productService.criar(produtoInvalido))
            .toThrow('O campo desconto e obrigatorio e deve ser um numero entre 0 e 100.');
    });

    it('deletar desativa o produto e retorna mensagem de sucesso', () => {
        const result = productService.deletar(1);

        expect(result).toEqual({ mensagem: 'Produto desativado com sucesso!' });
        expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('deletar lança erro quando o produto já está desativado', () => {
        expect(() => productService.deletar(2))
            .toThrow('Produto nao encontrado.');
    });

    it('criar lança erro quando o corpo contém campos não permitidos como description', () => {
        const produtoInvalido = {
            ...produtoValido,
            description: 'Um notebook gamer de última geração'
        };
        expect(() => productService.criar(produtoInvalido))
            .toThrow('Campos nao permitidos: description.');
    });

    it('atualizar lança erro quando o corpo contém campos não permitidos como description', () => {
        const dadosInvalidos = {
            description: 'Nova descrição'
        };
        expect(() => productService.atualizar(1, dadosInvalidos))
            .toThrow('Campos nao permitidos: description.');
    });

});
