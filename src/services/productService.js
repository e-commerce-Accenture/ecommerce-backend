import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoArquivo = path.join(__dirname, "..", "repositories", "data", "products.json");
const CAMPOS_PERMITIDOS = ["name", "price", "description", "stock"];
const TAMANHO_MINIMO_NOME = 2;
const TAMANHO_MAXIMO_NOME = 100;
const TAMANHO_MAXIMO_DESCRICAO = 1000;

function lerArquivo() {

    if (!fs.existsSync(caminhoArquivo)) {
        throw erroValidacao("Arquivo de produtos nao encontrado.", 500);
    }

    const dados = fs.readFileSync(caminhoArquivo, "utf-8");

    try {
        const produtos = JSON.parse(dados || "[]");

        if (!Array.isArray(produtos)) {
            throw erroValidacao("Arquivo de produtos deve conter uma lista.", 500);
        }

        return produtos;
    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        throw erroValidacao("Arquivo de produtos contem JSON invalido.", 500);
    }
}

function escreverArquivo(dados) {

    if (!Array.isArray(dados)) {
        throw erroValidacao("Dados de produtos invalidos para gravacao.", 500);
    }

    try {
        fs.writeFileSync(caminhoArquivo, JSON.stringify(dados, null, 2), "utf-8");
    } catch (error) {
        throw erroValidacao("Erro ao gravar produtos no arquivo.", 500);
    }
}

function listarTodos() {

    return lerArquivo().filter(produto => produto.ativo === true);
}

function listarCancelados() {

    return lerArquivo().filter(produto => produto.ativo === false);
}


function erroValidacao(mensagem, statusCode = 400) {
    const error = new Error(mensagem);
    error.statusCode = statusCode;
    return error;
}


function validarProduto(novoProduto) {
    if (!novoProduto || typeof novoProduto !== "object" || Array.isArray(novoProduto)) {
        throw erroValidacao("O corpo da requisicao deve ser um objeto JSON.");
    }


    const camposInvalidos = Object.keys(novoProduto).filter(campo => !CAMPOS_PERMITIDOS.includes(campo));

    if (camposInvalidos.length > 0) {
        throw erroValidacao(`Campos nao permitidos: ${camposInvalidos.join(", ")}.`);
    }

    const { name, price, description, stock } = novoProduto;
    const nomeTratado = typeof name === "string" ? name.trim() : "";
    const descricaoTratada = typeof description === "string" ? description.trim() : "";

    if (!nomeTratado) {
        throw erroValidacao("O campo name e obrigatorio e deve ser um texto.");
    }

    if (nomeTratado.length < TAMANHO_MINIMO_NOME || nomeTratado.length > TAMANHO_MAXIMO_NOME) {
        throw erroValidacao(`O campo name deve ter entre ${TAMANHO_MINIMO_NOME} e ${TAMANHO_MAXIMO_NOME} caracteres.`);
    }

    if (typeof price !== "number" || Number.isNaN(price) || price <= 0) {
        throw erroValidacao("O campo price e obrigatorio e deve ser um numero maior que zero.");
    }

    if (!descricaoTratada) {
        throw erroValidacao("O campo description e obrigatorio e deve ser um texto.");
    }

    if (descricaoTratada.length > TAMANHO_MAXIMO_DESCRICAO) {
        throw erroValidacao(`O campo description deve ter no maximo ${TAMANHO_MAXIMO_DESCRICAO} caracteres.`);
    }

    if (!Number.isInteger(stock) || stock < 0) {
        throw erroValidacao("O campo stock e obrigatorio e deve ser um numero inteiro maior ou igual a zero.");
    }
}


function validarAtualizacaoProduto(dadosAtualizacao) {
    if (!dadosAtualizacao || typeof dadosAtualizacao !== "object" || Array.isArray(dadosAtualizacao)) {
        throw erroValidacao("O corpo da requisicao deve ser um objeto JSON.");
    }

    const campos = Object.keys(dadosAtualizacao);

    if (campos.length === 0) {
        throw erroValidacao("Informe ao menos um campo para atualizar.");
    }

    const camposInvalidos = campos.filter(campo => !CAMPOS_PERMITIDOS.includes(campo));

    if (camposInvalidos.length > 0) {
        throw erroValidacao(`Campos nao permitidos: ${camposInvalidos.join(", ")}.`);
    }

    if ("name" in dadosAtualizacao) {
        const nomeTratado = typeof dadosAtualizacao.name === "string" ? dadosAtualizacao.name.trim() : "";

        if (!nomeTratado) {
            throw erroValidacao("O campo name deve ser um texto.");
        }

        if (nomeTratado.length < TAMANHO_MINIMO_NOME || nomeTratado.length > TAMANHO_MAXIMO_NOME) {
            throw erroValidacao(`O campo name deve ter entre ${TAMANHO_MINIMO_NOME} e ${TAMANHO_MAXIMO_NOME} caracteres.`);
        }
    }

    if ("price" in dadosAtualizacao && (typeof dadosAtualizacao.price !== "number" || Number.isNaN(dadosAtualizacao.price) || dadosAtualizacao.price <= 0)) {
        throw erroValidacao("O campo price deve ser um numero maior que zero.");
    }

    if ("description" in dadosAtualizacao) {
        const descricaoTratada = typeof dadosAtualizacao.description === "string" ? dadosAtualizacao.description.trim() : "";

        if (!descricaoTratada) {
            throw erroValidacao("O campo description deve ser um texto.");
        }

        if (descricaoTratada.length > TAMANHO_MAXIMO_DESCRICAO) {
            throw erroValidacao(`O campo description deve ter no maximo ${TAMANHO_MAXIMO_DESCRICAO} caracteres.`);
        }
    }

    if ("stock" in dadosAtualizacao && (!Number.isInteger(dadosAtualizacao.stock) || dadosAtualizacao.stock < 0)) {
        throw erroValidacao("O campo stock deve ser um numero inteiro maior ou igual a zero.");
    }
}

function validarNomeDuplicado(produtos, nome, idIgnorado = null) {

    const nomeNormalizado = nome.trim().toLowerCase();
    const produtoDuplicado = produtos.some(produto => {
        return produto.id !== idIgnorado && produto.ativo === true && typeof produto.name === "string" && produto.name.trim().toLowerCase() === nomeNormalizado;
    });

    if (produtoDuplicado) {
        throw erroValidacao("Ja existe um produto ativo com esse nome.", 409);
    }
}

function validarNomeReativacao(nome) {

    if (!nome || typeof nome !== "string" || !nome.trim()) {
        throw erroValidacao("O campo name e obrigatorio para reativar o produto.");
    }
}

function criar(novoProduto) {
    validarProduto(novoProduto);

    const produtos = lerArquivo();
    validarNomeDuplicado(produtos, novoProduto.name);


    const proximoId = produtos.length > 0 ? Math.max(...produtos.map(produto => Number(produto.id))) + 1 : 1;

    const produtoFormatado = {
        id: String(proximoId),
        name: novoProduto.name.trim(),
        price: novoProduto.price,
        description: novoProduto.description.trim(),
        stock: novoProduto.stock,
        ativo: true
    };

    produtos.push(produtoFormatado);
    escreverArquivo(produtos);

    return produtoFormatado;
}

function buscarPorId(id) {

    if (!id || Number.isNaN(Number(id))) {
        throw erroValidacao("O id do produto deve ser numerico.");
    }

    const produtos = lerArquivo();
    const produto = produtos.find(item => item.id === String(id) && item.ativo === true);

    if (!produto) {
        throw erroValidacao("Produto nao encontrado.", 404);
    }

    return produto;
}

function atualizar(id, dadosAtualizacao) {

    if (!id || Number.isNaN(Number(id))) {
        throw erroValidacao("O id do produto deve ser numerico.");
    }

    validarAtualizacaoProduto(dadosAtualizacao);

    const produtos = lerArquivo();
    const produtoIndex = produtos.findIndex(produto => produto.id === String(id));

    if (produtoIndex === -1 || produtos[produtoIndex].ativo === false) {
        throw erroValidacao("Produto nao encontrado.", 404);
    }

    if ("name" in dadosAtualizacao) {
        validarNomeDuplicado(produtos, dadosAtualizacao.name, String(id));
    }

    const produtoAtualizado = {
        ...produtos[produtoIndex],
        ...("name" in dadosAtualizacao && { name: dadosAtualizacao.name.trim() }),
        ...("price" in dadosAtualizacao && { price: dadosAtualizacao.price }),
        ...("description" in dadosAtualizacao && { description: dadosAtualizacao.description.trim() }),
        ...("stock" in dadosAtualizacao && { stock: dadosAtualizacao.stock })
    };

    produtos[produtoIndex] = produtoAtualizado;
    escreverArquivo(produtos);

    return produtoAtualizado;
}

function deletar(id) {

    if (!id || Number.isNaN(Number(id))) {
        throw erroValidacao("O id do produto deve ser numerico.");
    }

    const produtos = lerArquivo();
    const produtoIndex = produtos.findIndex(produto => produto.id === String(id));

    if (produtoIndex === -1) {
        throw erroValidacao("Produto nao encontrado.", 404);
    }

    if (produtos[produtoIndex].ativo === false) {
        throw erroValidacao("Produto nao encontrado.", 404);
    }


    produtos[produtoIndex] = {
        ...produtos[produtoIndex],
        ativo: false
    };

    escreverArquivo(produtos);

    return { mensagem: "Produto desativado com sucesso!" };
}

function reativar(id, nome) {

    if (!id || Number.isNaN(Number(id))) {
        throw erroValidacao("O id do produto deve ser numerico.");
    }

    validarNomeReativacao(nome);

    const produtos = lerArquivo();
    const produtoIndex = produtos.findIndex(produto => produto.id === String(id));

    if (produtoIndex === -1) {
        throw erroValidacao("Produto cancelado nao encontrado.", 404);
    }

    const produto = produtos[produtoIndex];

    if (produto.ativo !== false) {
        throw erroValidacao("Produto nao esta cancelado.", 409);
    }

    if (produto.name.trim().toLowerCase() !== nome.trim().toLowerCase()) {
        throw erroValidacao("Nome informado nao corresponde ao produto cancelado.");
    }

    validarNomeDuplicado(produtos, produto.name, String(id));

    produtos[produtoIndex] = {
        ...produto,
        ativo: true
    };

    escreverArquivo(produtos);

    return produtos[produtoIndex];
}

export default {
    listarTodos,
    listarCancelados,
    buscarPorId,
    criar,
    atualizar,
    deletar,
    reativar
};
