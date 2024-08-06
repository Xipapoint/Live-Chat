import AppError from "../ApiError";

export class ValidationError extends AppError {
    constructor(message: string) {
      super(message, 400, 'ValidationError');
    }
}