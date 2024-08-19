import AppError from "../AppError";

export class UnathorizedError extends AppError {
    constructor(message: string) {
      super(message, 401, 'UnathorizedError');
    }
}