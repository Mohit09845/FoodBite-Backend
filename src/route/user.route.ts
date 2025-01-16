import express from 'express';

const router = express.Router();

import { createUser, getUser, updateUser } from '../controller/myuserController';
import { jwtCheck, jwtParse } from '../middleware/auth';
import { validateUserRequest } from '../middleware/validation';

router.route('/').post(jwtCheck,createUser);
router.route('/').get(jwtCheck,jwtParse,getUser);
router.route('/').put(jwtCheck,jwtParse,validateUserRequest,updateUser);

export default router;