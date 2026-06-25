import productsService from "../services/productService.js";



function getProdutos(req, res) {
    try {
        const lista = productsService.listarTodos();

        res.status(200).send(lista);
    } catch (error) {

        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

function getProdutoPorId(req, res) {
    try {

        const produto = productsService.buscarPorId(req.params.id);

        res.status(200).json(produto);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

function getProdutosCancelados(req, res) {
    try {

        const lista = productsService.listarCancelados();

        res.status(200).json(lista);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

function criarProduto(req, res) {
    try {
        const produtoSalvo = productsService.criar(req.body);

        res.status(201).send(produtoSalvo);
    } catch (error) {

        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

function atualizarProduto(req, res) {
    try {

        const produtoAtualizado = productsService.atualizar(req.params.id, req.body);

        res.status(200).json(produtoAtualizado);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

function deletarProduto(req, res) {
    try {
        const resultado = productsService.deletar(req.params.id);

        res.status(200).send(resultado);
    } catch (error) {

        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

function reativarProduto(req, res) {
    try {

        const produtoReativado = productsService.reativar(req.params.id, req.body.nome);

        res.status(200).json(produtoReativado);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

export {
    getProdutos,
    getProdutoPorId,
    getProdutosCancelados,
    criarProduto,
    atualizarProduto,
    deletarProduto,
    reativarProduto
};
