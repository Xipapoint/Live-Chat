import AppError from "../ApiError";

 export class DatabaseError extends AppError {
    constructor(message: string) {
      super(message, 500, 'DatabaseError');
    }
  }
