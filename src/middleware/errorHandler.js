import messages from '../utils/messages.js';
import { BusinessException } from '../utils/exceptions.js';

const errorHandler = (err, req, res, next) => {
    // erro que vem de uma regra de negocio(email duplo, não enctrd, etc.)
    if (err instanceof BusinessException) {
        return res.status(err.statusCode).json({
            error: err.name,
            message: err.message
        })
    }

    // Erro de bug, falha de rede, etc.
    console.error('Erro interno do servidor:', err);
    return res.status(500).json({
        error: 'InternalServerError',
        message: messages.generic.INTERNAL_ERROR
    });

}

export default errorHandler;