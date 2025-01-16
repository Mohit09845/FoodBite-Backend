import { RequestHandler } from 'express';
import User from '../model/user.model';

export const createUser: RequestHandler = async (req, res) => {
  try {
    const { auth0Id, email } = req.body;

    const existingUser = await User.findOne({ $or: [{ auth0Id }, { email }] });

    if (existingUser) {
      res.status(200).send();
      return;
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser.toObject());
    return;

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error in creating user' });
    return;
  }
};

export const getUser: RequestHandler = async (req, res) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });

    if (!currentUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(currentUser);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" })
    return;
  }
}

export const updateUser: RequestHandler = async (req, res) => {
  try {
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();

    res.send(user);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error in updating user' });
    return;
  }
}

