import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";

const errorMiddleware = (err: AppError | Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      // Если ошибка является экземпляром AppError, отправляем детальную информацию об ошибке
      res.status(err.statusCode).json({
        status: err.status,
        errorType: err.errorType,
        message: err.message,
        stack: err.stack 
      });
    } else {

      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        stack: err.stack
      });
    }
  };
  
  export default errorMiddleware;