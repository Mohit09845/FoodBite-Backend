import express from 'express';
import { param } from 'express-validator';
import { searchRestaurant } from '../controller/restaurantDetail';

const router = express.Router();

router.route("/search/:city").get(
    param("city").
    isString().
    trim().
    notEmpty().
    withMessage("City parameter must be a valid string"),
    searchRestaurant
);

export default router;