import express from "express";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import User from "../model/user.model.js";
import dotenv from "dotenv";
import { expressjwt } from "express-jwt";
import mongoose from "mongoose";

dotenv.config();

const createToken = (_id) => jwt.sign({ _id: _id }, process.env.JWT_KEY, {expiresIn: '1h'});

const validateJWT = expressjwt({
  secret: process.env.JWT_KEY,
  algorithms: ["HS256"],
});

const protectedRoutes = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).end();
    }
    next();
  } catch (error) {
    console.log("Error in protectedRoutes controller", error.message);
    return res.status(500).end();
  }
};

export const isAuthenticated = express
  .Router()
  .use(validateJWT, protectedRoutes);

export const register = async (req, res) => {
  const { username, fullname, email, password } = req.body;

  try {
    if (!username || !fullname || !email || !password) {
      return res.status(400).json({ message_error: "Error create user" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Existing user in database" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      fullname,
      email,
      password: hashed,
    };

    await User.create(newUser);

    res.status(201).json({ message: "User register successfully" });
  } catch (error) {
    console.log(`Error in register controller`, error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message_error: "Email not found, please try again or register",
      });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(401).json({ message_error: "Error in password" });
    }

    const token = createToken(user._id);

    res.status(200).json({
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      _id: user._id,
      accessToken: token,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message_error: "Internal server error" });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const updateUser = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json("User not found");
    }

    let hashed;

    if (updateUser.password) {
      const salt = await bcrypt.genSalt(10);
      hashed = await bcrypt.hash(updateUser.password, salt);
    }

    const newUserData = {
      username: updateUser.username,
      fullname: updateUser.fullname,
      email: user.email,
      password: hashed,
    };

    await User.findByIdAndUpdate(id, newUserData, { new: true });

    res.status(202).json({
      message: "User update successfully",
      user: {
        username: newUserData.username,
        fullname: newUserData.fullname,
        email: newUserData.email,
      },
    });
  } catch (error) {
    console.log("Error in update controller", error.message);
    res.status(500).json({ message_error: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message_error: "User not found" });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({message: 'User delete successfully'});
  } catch (error) {
    console.log("Error in delete controller", error.message);
    res.status(500).json({ message_error: "Internal server error" });
  }
};
