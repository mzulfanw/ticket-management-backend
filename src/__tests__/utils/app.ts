import express from "express"
import type { Router } from "express"
import { SafeUserEntity } from "../../domains/auth/domain/auth.entity"
import { errorHandler } from "../../middleware/errorhandler"

export const createTestApp = (
  controllerRouter: Router,
  user: SafeUserEntity | null,
  basePath: string
) => {
  const app = express()
  app.use(express.json())
  app.use((req, res, next) => {
    req.user = user ?? {
      _id: "user1",
      name: "Helpdesk Agent",
      email: "l1@example.com",
      role: "L1"
    };
    next();
  });
  app.use(basePath, controllerRouter);
  app.use(errorHandler);
  return app;
}
