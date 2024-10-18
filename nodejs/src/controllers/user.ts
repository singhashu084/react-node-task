import User from "../models/user";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  password: string;
}

// getAllUsers function
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const allUsers = await User.find();
    res.status(200).json({ result: allUsers });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// signin function
export const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const existingUser: IUser | null = await User.findOne({ email });
    if (!existingUser) {
      res.status(404).json({ message: "User does not exist!" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid Credentials!" });
      return;
    }


    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

// signup function
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists!" });
      return
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result: IUser = await User.create({ email, name, password: hashedPassword });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      "test",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
