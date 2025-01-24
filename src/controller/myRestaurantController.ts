import { RequestHandler } from "express";
import Restaurant from "../model/restaurant";
import cloudinary from "../utils/cloudinary";
import mongoose from "mongoose";

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.uploader.upload(dataURI);
  return uploadResponse.url;
};

export const createRestaurant: RequestHandler = async (req, res) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });

    if (existingRestaurant) {
      res.status(409).json({ message: "Restaurant already exists" });
      return;
    }

    const imageUrl = await uploadImage(req.file as Express.Multer.File)

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = imageUrl;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdate = new Date();
    await restaurant.save();

    res.status(201).send(restaurant);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

export const getMyRestaurant: RequestHandler = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      res.status(404).json({ message: "restaurant not found" });
      return;
    }
    res.json(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching restaurant" });
    return;
  }
};

export const updateRestaurant: RequestHandler = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdate = new Date();

    if (req.file) {
        const imageUrl = await uploadImage(req.file as Express.Multer.File);
        restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();
    res.status(200).send(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error updating restaurant" });
    return;
  }
};
