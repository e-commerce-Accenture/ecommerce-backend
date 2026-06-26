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

class CategoryAlreadyExists extends BusinessException {
    constructor(message) {
        super(message, 409);
        this.name = 'CategoryAlreadyExists';
    }
}

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

class UnauthorizedException extends BusinessException {
    constructor(message) {
        super(message, 401);
        this.name = 'UnauthorizedException';
    }
}

class ForbiddenException extends BusinessException {
    constructor(message) {
        super(message, 403);
        this.name = 'ForbiddenException';
    }
}
class ConflictException extends BusinessException {
    constructor(message) {
        super(message, 409);
        this.name = 'ConflictException';
    }
}

class BadRequestException extends BusinessException {
    constructor(message) {
        super(message, 400);
        this.name = 'BadRequestException';
    }

}

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
    UserAlreadyExists,
    EmailAlreadyExists,
    CategoryAlreadyExists,
    InvalidCredentials,
    UnauthorizedException,
    ForbiddenException,
    ConflictException,
    BadRequestException,
    ServiceUnavailableException
};