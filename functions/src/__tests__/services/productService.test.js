import { describe, it, expect, vi, beforeEach } from 'vitest';

// Assim o service uma versão falsa do fs
vi.mock('fs');

import fs from 'fs';
import productService from '../../services/productService.js';

// Produto válido base para reutilizar nos testes
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

// Lista simulada de produtos no "arquivo JSON"
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
        // Antes simula que o arquivo existe e retorna os produtos mock
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(JSON.stringify(produtosMock));
        fs.writeFileSync.mockImplementation(() => {});
    });

    // CENÁRIO 1: Listar apenas produtos ativos

    it('listarTodos retorna apenas produtos com ativo === true', () => {
        const result = productService.listarTodos();

        // Só o Notebook está ativo, o Mouse está desativado
        expect(result).toHaveLength(1);
        expect(result[0].nome).toBe('Notebook Gamer');
        expect(result[0].ativo).toBe(true);
    });

    
    // CENÁRIO 2: Listar apenas produtos cancelados

    it('listarCancelados retorna apenas produtos com ativo === false', () => {
        const result = productService.listarCancelados();

        expect(result).toHaveLength(1);
        expect(result[0].nome).toBe('Mouse sem fio');
        expect(result[0].ativo).toBe(false);
    });

    // CENÁRIO 3: Buscar produto por ID válido
    
    it('buscarPorId retorna o produto correto quando o ID existe e está ativo', () => {
        const result = productService.buscarPorId(1);

        expect(result.id).toBe(1);
        expect(result.nome).toBe('Notebook Gamer');
    });

    // CENÁRIO 4: Buscar produto com ID inválido

    it('buscarPorId lança erro quando o ID não é numérico', () => {
        expect(() => productService.buscarPorId('abc')).toThrow('O id do produto deve ser numerico.');
    });

    // CENÁRIO 5: Criar produto com precoAtual maior que precoOriginal
    
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

    // CENÁRIO 6: Criar produto com nome duplicado
    
    it('criar lança erro quando já existe produto ativo com o mesmo nome', () => {
        // "Notebook Gamer" já está na lista mock como ativo
        expect(() => productService.criar(produtoValido))
            .toThrow('Ja existe um produto ativo com esse nome.');
    });

    // CENÁRIO 7: Criar produto com nome muito curto
    
    it('criar lança erro quando o nome tem menos de 2 caracteres', () => {
        const produtoInvalido = { ...produtoValido, nome: 'A' };

        expect(() => productService.criar(produtoInvalido))
            .toThrow('O campo nome deve ter entre 2 e 100 caracteres.');
    });

    // CENÁRIO 8: Criar produto com desconto inválido
    
    it('criar lança erro quando o desconto é maior que 100', () => {
        const produtoInvalido = { ...produtoValido, nome: 'Produto Novo', desconto: 150 };

        expect(() => productService.criar(produtoInvalido))
            .toThrow('O campo desconto e obrigatorio e deve ser um numero entre 0 e 100.');
    });

    // CENÁRIO 9: Deletar produto (soft delete)
    
    it('deletar desativa o produto e retorna mensagem de sucesso', () => {
        const result = productService.deletar(1);

        expect(result).toEqual({ mensagem: 'Produto desativado com sucesso!' });
        // Verifica que o arquivo foi reescrito (soft delete aplicado)
        expect(fs.writeFileSync).toHaveBeenCalled();
    });

    // CENÁRIO 10: Deletar produto já desativado
    
    it('deletar lança erro quando o produto já está desativado', () => {
        // ID 2 é o Mouse sem fio, que já está ativo: false
        expect(() => productService.deletar(2))
            .toThrow('Produto nao encontrado.');
    });

});
