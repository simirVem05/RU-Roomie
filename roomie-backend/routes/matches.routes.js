import { Router } from 'express';

const matchesRouter = Router();

// two people swipe right on each other
matchesRouter.post('/', (req, res) => res.send({ title: 'CREATE match'}));

matchesRouter.get('/', (req, res) => res.send({ title: 'GET all matches'}));

// get one match
matchesRouter.get('/:id', (req, res) => res.send({ title: 'GET match'}));

// unmatch
matchesRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE match'}));

export default matchesRouter;