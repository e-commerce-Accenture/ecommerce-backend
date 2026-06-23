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

class EmailAlreadyExists extends BusinessException {
    constructor(message) {
        super(message, 409);
        this.name = 'EmailAlreadyExists';
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
export {
    BusinessException,
    NotFoundException,
    UserNotFound,
    UserAlreadyExists,
    EmailAlreadyExists,
    InvalidCredentials,
    UnauthorizedException,
    ForbiddenException,
    ConflictException,
    BadRequestException,
};