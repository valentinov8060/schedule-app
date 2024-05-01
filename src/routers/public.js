import express from 'express';

import userController from '../controllers/user-controller.js';
import scheduleController from '../controllers/schedule-controller.js';

const publicRouter = new express.Router();

publicRouter.post('/user/login', userController.login);
publicRouter.get('/schedule/list', scheduleController.list);
publicRouter.get('/schedule/user/:user', scheduleController.getUser);

export {
  publicRouter
}