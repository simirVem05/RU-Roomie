import { Router } from 'express';

const authRouter = Router();

authRouter.post('/sign-up', (req, res) => res.send({ title: 'Sign Up'}));
authRouter.post('/log-in', (req, res) => res.send({ title: 'Log In'}));
authRouter.post('/sign-out', (req, res) => res.send({ title: 'Sign Out'}));

export default authRouter;