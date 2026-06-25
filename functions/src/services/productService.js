import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoArquivo = path.join(__dirname, "..", "repositories", "data", "products.json");
const CAMPOS_PERMITIDOS = ["nome", "precoAtual", "precoOriginal", "desconto", "imagem", "categoria", "estoque", "marca"];
const TAMANHO_MINIMO_NOME = 2;
const TAMANHO_MAXIMO_NOME = 100;

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

function validarTextoObrigatorio(valor, campo) {
    const texto = typeof valor === "string" ? valor.trim() : "";

    if (!texto) {
        throw erroValidacao(`O campo ${campo} e obrigatorio e deve ser um texto.`);
    }

    return texto;
}

function validarNome(nome) {
    const nomeTratado = validarTextoObrigatorio(nome, "nome");

    if (nomeTratado.length < TAMANHO_MINIMO_NOME || nomeTratado.length > TAMANHO_MAXIMO_NOME) {
        throw erroValidacao(`O campo nome deve ter entre ${TAMANHO_MINIMO_NOME} e ${TAMANHO_MAXIMO_NOME} caracteres.`);
    }

    return nomeTratado;
}

function validarNumeroPositivo(valor, campo) {
    if (typeof valor !== "number" || Number.isNaN(valor) || valor <= 0) {
        throw erroValidacao(`O campo ${campo} e obrigatorio e deve ser um numero maior que zero.`);
    }
}

function validarInteiroNaoNegativo(valor, campo) {
    if (!Number.isInteger(valor) || valor < 0) {
        throw erroValidacao(`O campo ${campo} e obrigatorio e deve ser um numero inteiro maior ou igual a zero.`);
    }
}

function validarDesconto(desconto) {
    if (typeof desconto !== "number" || Number.isNaN(desconto) || desconto < 0 || desconto > 100) {
        throw erroValidacao("O campo desconto e obrigatorio e deve ser um numero entre 0 e 100.");
    }
}

function validarCamposPermitidos(dados) {
    const camposInvalidos = Object.keys(dados).filter(campo => !CAMPOS_PERMITIDOS.includes(campo));

    if (camposInvalidos.length > 0) {
        throw erroValidacao(`Campos nao permitidos: ${camposInvalidos.join(", ")}.`);
    }
}

function validarProduto(novoProduto) {
    if (!novoProduto || typeof novoProduto !== "object" || Array.isArray(novoProduto)) {
        throw erroValidacao("O corpo da requisicao deve ser um objeto JSON.");
    }

    validarCamposPermitidos(novoProduto);

    const { nome, precoAtual, precoOriginal, desconto, imagem, categoria, estoque, marca } = novoProduto;

    validarNome(nome);
    validarNumeroPositivo(precoAtual, "precoAtual");
    validarNumeroPositivo(precoOriginal, "precoOriginal");
    validarDesconto(desconto);
    validarTextoObrigatorio(imagem, "imagem");
    validarTextoObrigatorio(categoria, "categoria");
    validarInteiroNaoNegativo(estoque, "estoque");
    validarTextoObrigatorio(marca, "marca");

    if (precoAtual > precoOriginal) {
        throw erroValidacao("O campo precoAtual nao pode ser maior que precoOriginal.");
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

    validarCamposPermitidos(dadosAtualizacao);

    if ("nome" in dadosAtualizacao) {
        validarNome(dadosAtualizacao.nome);
    }

    if ("precoAtual" in dadosAtualizacao) {
        validarNumeroPositivo(dadosAtualizacao.precoAtual, "precoAtual");
    }

    if ("precoOriginal" in dadosAtualizacao) {
        validarNumeroPositivo(dadosAtualizacao.precoOriginal, "precoOriginal");
    }

    if ("desconto" in dadosAtualizacao) {
        validarDesconto(dadosAtualizacao.desconto);
    }

    if ("imagem" in dadosAtualizacao) {
        validarTextoObrigatorio(dadosAtualizacao.imagem, "imagem");
    }

    if ("categoria" in dadosAtualizacao) {
        validarTextoObrigatorio(dadosAtualizacao.categoria, "categoria");
    }

    if ("estoque" in dadosAtualizacao) {
        validarInteiroNaoNegativo(dadosAtualizacao.estoque, "estoque");
    }

    if ("marca" in dadosAtualizacao) {
        validarTextoObrigatorio(dadosAtualizacao.marca, "marca");
    }
}

function validarNomeDuplicado(produtos, nome, idIgnorado = null) {
    const nomeNormalizado = nome.trim().toLowerCase();
    const produtoDuplicado = produtos.some(produto => {
        return String(produto.id) !== String(idIgnorado) && produto.ativo === true && typeof produto.nome === "string" && produto.nome.trim().toLowerCase() === nomeNormalizado;
    });

    if (produtoDuplicado) {
        throw erroValidacao("Ja existe um produto ativo com esse nome.", 409);
    }
}

function validarNomeReativacao(nome) {
    if (!nome || typeof nome !== "string" || !nome.trim()) {
        throw erroValidacao("O campo nome e obrigatorio para reativar o produto.");
    }
}

function criar(novoProduto) {
    validarProduto(novoProduto);

    const produtos = lerArquivo();
    validarNomeDuplicado(produtos, novoProduto.nome);

    const proximoId = produtos.length > 0 ? Math.max(...produtos.map(produto => Number(produto.id))) + 1 : 1;

    const produtoFormatado = {
        id: proximoId,
        nome: novoProduto.nome.trim(),
        precoAtual: novoProduto.precoAtual,
        precoOriginal: novoProduto.precoOriginal,
        desconto: novoProduto.desconto,
        imagem: novoProduto.imagem.trim(),
        categoria: novoProduto.categoria.trim(),
        estoque: novoProduto.estoque,
        marca: novoProduto.marca.trim(),
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
    const produto = produtos.find(item => String(item.id) === String(id) && item.ativo === true);

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
    const produtoIndex = produtos.findIndex(produto => String(produto.id) === String(id));

    if (produtoIndex === -1 || produtos[produtoIndex].ativo === false) {
        throw erroValidacao("Produto nao encontrado.", 404);
    }

    if ("nome" in dadosAtualizacao) {
        validarNomeDuplicado(produtos, dadosAtualizacao.nome, id);
    }

    const precoAtualFinal = "precoAtual" in dadosAtualizacao ? dadosAtualizacao.precoAtual : produtos[produtoIndex].precoAtual;
    const precoOriginalFinal = "precoOriginal" in dadosAtualizacao ? dadosAtualizacao.precoOriginal : produtos[produtoIndex].precoOriginal;

    if (precoAtualFinal > precoOriginalFinal) {
        throw erroValidacao("O campo precoAtual nao pode ser maior que precoOriginal.");
    }

    const produtoAtualizado = {
        ...produtos[produtoIndex],
        ...("nome" in dadosAtualizacao && { nome: dadosAtualizacao.nome.trim() }),
        ...("precoAtual" in dadosAtualizacao && { precoAtual: dadosAtualizacao.precoAtual }),
        ...("precoOriginal" in dadosAtualizacao && { precoOriginal: dadosAtualizacao.precoOriginal }),
        ...("desconto" in dadosAtualizacao && { desconto: dadosAtualizacao.desconto }),
        ...("imagem" in dadosAtualizacao && { imagem: dadosAtualizacao.imagem.trim() }),
        ...("categoria" in dadosAtualizacao && { categoria: dadosAtualizacao.categoria.trim() }),
        ...("estoque" in dadosAtualizacao && { estoque: dadosAtualizacao.estoque }),
        ...("marca" in dadosAtualizacao && { marca: dadosAtualizacao.marca.trim() })
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
    const produtoIndex = produtos.findIndex(produto => String(produto.id) === String(id));

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
    const produtoIndex = produtos.findIndex(produto => String(produto.id) === String(id));

    if (produtoIndex === -1) {
        throw erroValidacao("Produto cancelado nao encontrado.", 404);
    }

    const produto = produtos[produtoIndex];

    if (produto.ativo !== false) {
        throw erroValidacao("Produto nao esta cancelado.", 409);
    }

    if (produto.nome.trim().toLowerCase() !== nome.trim().toLowerCase()) {
        throw erroValidacao("Nome informado nao corresponde ao produto cancelado.");
    }

    validarNomeDuplicado(produtos, produto.nome, id);

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
