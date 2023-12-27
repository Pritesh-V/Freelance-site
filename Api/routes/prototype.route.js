import express from 'express';
import { prototype } from '../controllers/prototype.controller.js';

const router = express.Router();

router.post('/proto', prototype);

export default router;