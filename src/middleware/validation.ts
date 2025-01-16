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