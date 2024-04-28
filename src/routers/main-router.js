import express from 'express';

import { publicRouter } from './public.js';
import { privateRouter } from './private.js';
import { errorResponse } from '../middleware/error-middleware.js';

const app = express();

// mem-parse body permintaan HTTP yang berformat JSON ke dalam objek dan tersedia pada req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(publicRouter)
app.use(privateRouter)
app.use(errorResponse)

export { 
  app 
}