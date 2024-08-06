import AppError from "../ApiError";

export class ExternalServiceError extends AppError {
    constructor(message: string) {
      super(message, 502, 'ServiceError');
    }
}
  