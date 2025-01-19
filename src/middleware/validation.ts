import { body, validationResult } from "express-validator";
import { RequestHandler } from "express";

const handleValidationErrors: RequestHandler = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errros: errors.array()})
        return;
    }
    next()
}

export const validateUserRequest = [
    body('name').isString().notEmpty().withMessage('Name must be a string'),
    body('addressLine1').isString().notEmpty().withMessage('AddressLine1 must be a string'),
    body('city').isString().notEmpty().withMessage('City must be a string'),
    body('country').isString().notEmpty().withMessage('Country must be a string'),
    handleValidationErrors
]

export const validateRestaurantRequest = [
    body("restaurantName").notEmpty().withMessage("Restaurant name is required"),
    body("city").notEmpty().withMessage("City name is required"),
    body("country").notEmpty().withMessage("Country name is required"),
    body("deliveryPrice").isFloat({min: 0}).withMessage("delivery price must be a positive number"),
    body("estimatedDeliveryTime").isInt({min: 0}).withMessage("delivery time must be a positive number"),
    body("cuisines").isArray().withMessage("Cuisines must be an array").not().isEmpty().withMessage("Cuisines array cannot be empty"),
    body("menuItems").isArray().withMessage("Menu items must be an array"),
    body("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
    body("menuItems.*.price").isFloat({min: 0}).withMessage("Menu item Price is required and must be a positive number"),
    handleValidationErrors
]