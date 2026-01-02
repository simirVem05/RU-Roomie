import { Router } from 'express';

import {getUser, getUserByClerkId, getUsers} from '../controllers/user.controller.js'

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get("/by-clerk/:clerkUserId", getUserByClerkId);
userRouter.get('/:id', getUser);
userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE user'}));
userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE user'}));

export default userRouter;