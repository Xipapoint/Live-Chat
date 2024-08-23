class AppError extends Error {
    public statusCode: number;
    public status: string;
    public errorType: string;

    constructor(message: string, statusCode: number, errorType: string) {
        super(message); // конструктор родителя
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.errorType = errorType
    }
    
}

export default AppError;
