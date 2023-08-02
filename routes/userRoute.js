import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.route("/register").post(userController.registerUser);
router.route("/:id").get(userController.getUserById);
router.route("/login").post(userController.loginUser);
router.route("/me").get(userController.getMe);
router.route("/").get(userController.getUsers);
router.route("/edit/:id").put(userController.editUser);
router.route("/:id").delete(userController.deleteUser);
router.route("/logout").post(userController.logoutUser);

export default router;
