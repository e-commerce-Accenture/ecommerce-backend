class BusinessException extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = 'BusinessException';
        this.statusCode = statusCode;
        this.isBusinessError = true;
    }
}

class UserAlreadyExists extends BusinessException {
    constructor(message) {
        super(message, 409);
        this.name = 'UserAlreadyExists';
    }
}

class ProductAlreadyExists extends BusinessException {
    constructor(message) {
        super(message, 409);
        this.name = 'ProductAlreadyExists';
    }
}


class EmailAlreadyExists extends BusinessException {
    constructor(message) {
        super(message, 409);
        this.name = 'EmailAlreadyExists';
    }
}

class CategoryAlreadyExists extends BusinessException {
    constructor(message) {
        super(message, 409);
        this.name = 'CategoryAlreadyExists';
    }
}

// recurso não encontrado
class NotFoundException extends BusinessException {
    constructor(message) {
        super(message, 404);
        this.name = 'NotFoundException';
    }
}

class UserNotFound extends NotFoundException {
    constructor(message) {
        super(message, 404);
        this.name = 'UserNotFound';
    }
}

class ProductNotFound extends NotFoundException {
    constructor(message) {
        super(message, 404);
        this.name = 'ProductNotFound';
    }
}

class CategoryNotFound extends NotFoundException {
    constructor(message) {
        super(message, 404);
        this.name = 'CategoryNotFound';
    }
}

class InvalidCredentials extends BusinessException {
    constructor(message) {
        super(message, 401);
        this.name = 'InvalidCredentials';
    }
}

// não autenticado (sem token ou senha errada)
class UnauthorizedException extends BusinessException {
    constructor(message) {
        super(message, 401);
        this.name = 'UnauthorizedException';
    }
}
// autenticado mas sem permissão
class ForbiddenException extends BusinessException {
    constructor(message) {
        super(message, 403);
        this.name = 'ForbiddenException';
    }
}
// conflito (ex: email duplicado)
class ConflictException extends BusinessException {
    constructor(message) {
        super(message, 409);
        this.name = 'ConflictException';
    }
}
// dados inválidos
class BadRequestException extends BusinessException {
    constructor(message) {
        super(message, 400);
        this.name = 'BadRequestException';
    }

}
// serviço externo indisponível ou falhando, tipo a IA caiu
class ServiceUnavailableException extends BusinessException {
    constructor(message) {
        super(message, 503);
        this.name = 'ServiceUnavailableException';
    }
}
export {
    BusinessException,
    NotFoundException,
    UserNotFound,
    CategoryNotFound,
    ProductNotFound,
    UserAlreadyExists,
    ProductAlreadyExists,
    EmailAlreadyExists,
    CategoryAlreadyExists,
    InvalidCredentials,
    UnauthorizedException,
    ForbiddenException,
    ConflictException,
    BadRequestException,
    ServiceUnavailableException
};