import { Router } from "express";
import authRoutes from '../domains/auth/interfaces/auth.routes';
import ticketRoutes from "../domains/ticket/interfaces/ticket.routes"

const router = Router()

router.use('/auth', authRoutes)
router.use('/ticket', ticketRoutes)

export default router