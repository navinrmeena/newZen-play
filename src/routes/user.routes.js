import { Router } from "express";
import { registerUser, registerlogin } from "../controllers/user.controller.js";

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(registerlogin)



export default router


