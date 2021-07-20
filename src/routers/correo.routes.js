import { Router } from 'express'

const router = Router();
const {checkToken}=require('../auth/token_validation');
import * as emailCtr from '../controllers/correo.controller';

//router.post("/", emailCtr.email);
router.post('/create',emailCtr.createCorreo);

export default router;