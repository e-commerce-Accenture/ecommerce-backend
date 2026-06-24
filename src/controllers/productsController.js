const productsService = require("../services/productService");

function getProdutos(req, res) {
    try {
        const lista = productsService.listarTodos();

        res.status(200).send(lista);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

function criarProduto(req, res) {
    try {
        const produtoSalvo = productsService.criar(req.body);

        res.status(201).send(produtoSalvo);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

function deletarProduto(req, res) {
    try {
        const resultado = productsService.deletar(req.params.id);

        res.status(200).send(resultado);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    getProdutos,
    criarProduto,
    deletarProduto
};