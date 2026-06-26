import messages from '../utils/messages.js';
import { BusinessException, ForbiddenException } from '../utils/exceptions.js';
import { ZodError } from 'zod';

const errorHandler = (err, req, res, next) => {
    if (err instanceof BusinessException) {
        return res.status(err.statusCode).json({
            error: err.name,
            message: err.message
        })
    }

    if (err instanceof ForbiddenException) {
        return res.status(err.statusCode).json({
            error: err.name,
            message: err.message
        })
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            error: err.name,
            message: "Invalid data",
            fields: err.flatten().fieldErrors
        })
    }

    console.error('Erro interno do servidor:', err);
    return res.status(500).json({
        error: 'InternalServerError',
        message: messages.generic.INTERNAL_ERROR
    });

}

export default errorHandler;