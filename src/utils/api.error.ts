export class ApiError extends Error {
  public statusCode: number;
  public data: unknown;

  constructor(statusCode: number, message: string, data: unknown = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}
