import { Router } from "express";
import { UserRepository } from "../repository/auth.repository";
import { AuthService } from "../application/auth.service";
import { AuthController } from "./auth.controller";
import { validate } from "../../../middleware/validate";
import { LoginRequestDTO } from "../dto/auth.request.dto";
import { asyncHandler } from "../../../middleware/async";

const router = Router()
const repo = new UserRepository()
const service = new AuthService(repo)
const controller = new AuthController(service)

router.post('/login', validate(LoginRequestDTO), asyncHandler(controller.login.bind(controller)))

export default router