import { Request, Response, NextFunction } from "express";
import AppError from "../errors/ApiError";

const errorMiddleware = (err: AppError | Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      // Если ошибка является экземпляром AppError, отправляем детальную информацию об ошибке
      res.status(err.statusCode).json({
        status: err.status,
        errorType: err.errorType,
        message: err.message,
        stack: err.stack // Показать стек ошибок только в режиме разработки
      });
    } else {
      // Для всех остальных ошибок используем стандартную обработку
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        stack: err.stack
      });
    }
  };
  
  export default errorMiddleware;