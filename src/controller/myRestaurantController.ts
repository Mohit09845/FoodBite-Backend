import { RequestHandler } from 'express';
import Restaurant from '../model/restaurant';
import cloudinary from "../utils/cloudinary"
import mongoose from 'mongoose';

export const createRestaurant: RequestHandler = async (req, res) => {
    try {
        const existingRestaurant = await Restaurant.findOne({ user: req.userId });

        if (existingRestaurant) {
            res.status(409).json({ message: "Restaurant already exists" });
            return;
        }

        const image = req.file as Express.Multer.File;
        const base64Image = Buffer.from(image.buffer).toString("base64");
        const dataURI = `data:${image.mimetype};base64,${base64Image}`;

        const uploadResponse = await cloudinary.uploader.upload(dataURI);

        const restaurant = new Restaurant(req.body);
        restaurant.imageUrl = uploadResponse.url;
        restaurant.user = new mongoose.Types.ObjectId(req.userId);
        restaurant.lastUpdate = new Date()
        await restaurant.save();

        res.status(201).send(restaurant);
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" })
        return;
    }
}

export const getMyRestaurant: RequestHandler = async(req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.userId });
        if(!restaurant){
            res.status(404).json({message: "restaurant not found"})
            return;
        }
        res.json(restaurant);
    } catch(error) {
        console.log("error", error);
        res.status(500).json({message: "Error fetching restaurant"});
        return;
    }
}