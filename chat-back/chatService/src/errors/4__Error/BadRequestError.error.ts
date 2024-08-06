import AppError from '../ApiError';

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(message, 400, 'BadRequestError');
    }
}