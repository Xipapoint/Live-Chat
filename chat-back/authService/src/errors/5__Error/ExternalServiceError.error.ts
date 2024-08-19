import AppError from "../AppError";

export class ExternalServiceError extends AppError {
    constructor(message: string) {
      super(message, 502, 'ServiceError');
    }
}
  