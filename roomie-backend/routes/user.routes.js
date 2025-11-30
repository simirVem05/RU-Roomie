import { Router } from 'express';

import {getUser, getUsers} from '../controllers/user.controller.js'

import {signUp} from '../controllers/auth.controller.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', getUser);

userRouter.post('/', signUp);

userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE user'}));

userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE user'}));

export default userRouter;