const fs = require("fs");
const path = require("path"); 

const caminhoArquivo = path.join(__dirname, "..", "data", "products.json");

function lerArquivo() {
    const dados = fs.readFileSync(caminhoArquivo, "utf-8");
    return JSON.parse(dados);
}

function escreverArquivo(dados) {
    fs.writeFileSync(caminhoArquivo, JSON.stringify(dados, null, 2), "utf-8");
}

function listarTodos() {
    return lerArquivo(); 
}

function criar(novoProduto) {
    const produtos = lerArquivo();
    
    const proximoId = produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1;
    
    const produtoFormatado = {
        id: proximoId,
        ...novoProduto
    };

    
    produtos.push(produtoFormatado);
    escreverArquivo(produtos);
    
    return produtoFormatado;
}

function deletar(id) {
    const idNumero = Number(id);
    const produtos = lerArquivo();
    
    const listaFiltrada = produtos.filter(produto => produto.id !== idNumero);
    
    escreverArquivo(listaFiltrada);
    
    return { mensagem: "Produto deletado com sucesso!" }; 
}

module.exports = {
    listarTodos,
    criar,
    deletar
};