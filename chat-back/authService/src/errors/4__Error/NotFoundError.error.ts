import AppError from '../AppError';

class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404, 'NotFoundError');
    }
}

export default NotFoundError;