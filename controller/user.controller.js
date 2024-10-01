import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/user.model.js";
import dotenv from "dotenv";
import { expressjwt } from "express-jwt";

dotenv.config();

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
  const { firstname, lastname, email, password } = req.body;

  try {
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "Error create user" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = {
      firstname,
      lastname,
      email,
      password: hashed,
    };

    const user = await User.create(newUser);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json(token);
  } catch (error) {
    console.log(`Error in register controller`, error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Error email or password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, please try again or register" });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(401).json({ message: "Error in password" });
    }

    res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
};
