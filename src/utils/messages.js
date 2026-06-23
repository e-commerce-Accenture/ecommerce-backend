// criei algumas pra gente não usar strings soltas, tipo podemos
// uma genérica e tals, mas ficariam redundantes
// adicionei algumas a mais para facilitar os testes

const messages = {

    // mensagens para login e registro
    auth: {
        EMAIL_ALREADY_EXISTS: 'E-mail já cadastrado.',
        USER_NOT_FOUND: 'Usuário não encontrado.',
        INVALID_PASSWORD: 'Senha incorreta.',
        REGISTER_SUCCESS: 'Usuário criado com sucesso.',
        LOGIN_SUCCESS: 'Login realizado com sucesso.',
        TOKEN_MISSING: 'Token não fornecido.',
        TOKEN_INVALID: 'Token inválido.',
        FORBIDDEN: 'Restrito ao administrador.',
    },
    // mensagens para produtos
    product: {
        NOT_FOUND: 'Produto não encontrado.',
        CREATED: 'Produto criado com sucesso.',
        UPDATED: 'Produto atualizado com sucesso.',
        DELETED: 'Produto removido com sucesso.',
    },
    // mensagens para carrinho
    cart: {
        ITEM_ADDED: 'Item adicionado ao carrinho.',
        ITEM_REMOVED: 'Item removido do carrinho.',
        CART_CLEARED: 'Carrinho esvaziado.',
        CART_EMPTY: 'O carrinho está vazio.',
        ITEM_NOT_FOUND: 'Item não encontrado no carrinho.',
    },
    // mensagens para pedidos
    order: {
        CREATED: 'Pedido realizado com sucesso.',
        NOT_FOUND: 'Pedido não encontrado.',
    },
    // mensagens para IA
    ai: {
        DESCRIPTION_GENERATED: 'Descrição gerada com sucesso.',
        GENERATION_FAILED: 'Falha ao gerar descrição. Tente novamente.',
        NAME_REQUIRED: 'O nome do produto é obrigatório.',
    },
    // mensagens genéricas
    generic: {
        INTERNAL_ERROR: 'Erro interno do servidor.',
        NOT_FOUND: 'Recurso não encontrado.',
        BAD_REQUEST: 'Requisição inválida.',
        AI_REQUISITION_FAILED: "AI requisition failed"
    },
};
export default messages;