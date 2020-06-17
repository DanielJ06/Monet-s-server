import {Router} from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import WalletController from './app/controllers/WalletController';
import TransactionController from './app/controllers/TransactionController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/wallet', WalletController.index);
routes.post('/wallet', WalletController.store);
routes.put('/wallet/:id', WalletController.update);
routes.delete('/wallet/:id', WalletController.delete);

routes.post('/transaction', TransactionController.store);

export default routes;
