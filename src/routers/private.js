import express from 'express';

import scheduleController from '../controllers/schedule-controller.js';
import userController from '../controllers/user-controller.js';
import {authMiddleware} from '../middleware/auth-middleware.js';

const privateRouter = new express.Router();

privateRouter.use(authMiddleware);

privateRouter.get('/user/token', userController.token);
privateRouter.post('/schedule/create', scheduleController.create);
privateRouter.put('/schedule/update/:id_mata_kuliah', scheduleController.update);
privateRouter.delete('/schedule/remove/:id_mata_kuliah', scheduleController.remove);

export {
  privateRouter
}