import express from "express";
import {
  deleteUser,
  login,
  register,
  isAuthenticated,
  update,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/:id", isAuthenticated, update);
router.delete("/:id", isAuthenticated, deleteUser);

export default router;
