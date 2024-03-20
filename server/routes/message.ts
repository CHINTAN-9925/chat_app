import express from "express";

import { validateUser } from "../middlewares/auth";
import { allMessages, sendMessage } from "../controllers/message";

const router = express.Router();

router.use(validateUser);

router.route("/:chatId").get(allMessages);
router.route("/").post(sendMessage);

export default router;