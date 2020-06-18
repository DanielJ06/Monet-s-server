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

routes.get('/transaction', TransactionController.index);
routes.post('/transaction', TransactionController.store);
routes.put('/transaction/:id', TransactionController.update);
routes.delete('/transaction/:id', TransactionController.delete);

export default routes;
