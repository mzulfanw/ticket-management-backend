import type { Response } from "express";
import { status as httpStatus } from "http-status"

export class ApiSuccess<T = unknown> {
  public code: number;
  public readonly message: string;
  public readonly data: T;

  constructor(data: T, message = 'Success', code = httpStatus.OK,) {
    this.data = data;
    this.message = message;
    this.code = code
  }

  async send(res: Response) {
    const payload = {
      message: this.message,
      data: this.data,
      code: this.code
    }
    return res.status(this.code).json(payload)
  }
}
