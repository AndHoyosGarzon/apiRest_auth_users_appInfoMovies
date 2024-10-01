import express from "express";
import {
  deleteUser,
  login,
  register,
  isAuthenticated,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", isAuthenticated, login);

router.delete("/:id", deleteUser);
export default router;
