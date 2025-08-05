import { Router } from 'express';

const messagesRouter = Router();

messagesRouter.post('/', (req, res) => res.send({ title: 'CREATE message'}));

messagesRouter.get('/', (req, res) => res.send({ title: 'GET all messages'}));

messagesRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE message'}));

export default messagesRouter;