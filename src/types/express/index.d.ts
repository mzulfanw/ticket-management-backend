declare namespace Express {
  export interface Request {
    user?: {
      _id: string;
      email: string;
      name: string;
      role: string;
    }
  }
}