
import express from "express";
import { addPicUrl, allUsers, login, register } from "../controllers/user";
import { validateUser } from "../middlewares/auth";

const router = express.Router();

router.route("/").get(validateUser, allUsers);
router.route("/register").post(register);
router.route("/picupdate").put(addPicUrl);
router.post("/login", login);

export default router;
