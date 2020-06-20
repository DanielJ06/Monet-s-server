import {Router} from 'express';
import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import WalletController from './app/controllers/WalletController';
import TransactionController from './app/controllers/TransactionController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middleware/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

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

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
