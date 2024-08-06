import AppError from "../ApiError";

export class ConflictError extends AppError {
    constructor(message: string) {
      super(message, 409, 'ConflictError');
    }
}