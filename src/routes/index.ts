import { Router } from "express";
import authRoutes from '../domains/auth/interfaces/auth.routes';

const router = Router()

router.use('/auth', authRoutes)

export default router