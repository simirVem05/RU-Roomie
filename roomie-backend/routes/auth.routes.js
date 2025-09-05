import { Router } from 'express';

import {signUp, logIn, signOut} from '../controllers/auth.controller.js'

const authRouter = Router();

//Path: /api/v1/auth/sign-up (POST) -> POST BODY -> {name, email, password} -> CREATES A NEW USER

authRouter.post('/sign-up', signUp);
authRouter.post('/log-in', logIn);
authRouter.post('/sign-out', signOut);

export default authRouter;