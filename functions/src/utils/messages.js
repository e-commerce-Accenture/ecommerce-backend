
const messages = {

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
    product: {
        NOT_FOUND: 'Produto não encontrado.',
        CREATED: 'Produto criado com sucesso.',
        UPDATED: 'Produto atualizado com sucesso.',
        DELETED: 'Produto removido com sucesso.',
    },
    cart: {
        ITEM_ADDED: 'Item adicionado ao carrinho.',
        ITEM_REMOVED: 'Item removido do carrinho.',
        CART_CLEARED: 'Carrinho esvaziado.',
        CART_EMPTY: 'O carrinho está vazio.',
        ITEM_NOT_FOUND: 'Item não encontrado no carrinho.',
    },

    order: {
        CREATED: 'Pedido realizado com sucesso.',
        NOT_FOUND: 'Pedido não encontrado.',
    },
    ai: {
        DESCRIPTION_GENERATED: 'Descrição gerada com sucesso.',
        GENERATION_FAILED: 'Falha ao gerar descrição. Tente novamente.',
        NAME_REQUIRED: 'O nome do produto é obrigatório.',
    },
    generic: {
        INTERNAL_ERROR: 'Erro interno do servidor.',
        NOT_FOUND: 'Recurso não encontrado.',
        BAD_REQUEST: 'Requisição inválida.',
        AI_REQUISITION_FAILED: "Falha na requisição",
    },
};
export default messages;