import type { Response } from "express";
import { status as httpStatus } from "http-status"

export class ApiSuccess<T = unknown> {
  public status: number;
  public readonly message: string;
  public readonly data: T;

  constructor(data: T, message = 'Success', status = httpStatus.OK,) {
    this.data = data;
    this.message = message;
    this.status = status
  }

  async send(res: Response) {
    const payload = {
      message: this.message,
      data: this.data
    }
    return res.status(this.status).json(payload)
  }
}
