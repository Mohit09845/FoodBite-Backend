import express from 'express';
import multer from 'multer';
import { createRestaurant, getMyRestaurant, updateRestaurant } from '../controller/myRestaurantController';
import { jwtCheck, jwtParse } from '../middleware/auth';
import { validateRestaurantRequest } from '../middleware/validation';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

router.route('/').post(upload.single("imageFile"),validateRestaurantRequest,jwtCheck,jwtParse,createRestaurant);
router.route('/').get(jwtCheck,jwtParse,getMyRestaurant);
router.route('/').put(upload.single('imageFile'),validateRestaurantRequest,jwtCheck,jwtParse,updateRestaurant);

export default router;