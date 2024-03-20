import express from "express";

import { validateUser } from "../middlewares/auth";
import { accessChat, createGroupChat, fetchChats, joinGroup, leaveGroup, renameGroup } from "../controllers/chat";

const router = express.Router();

router.use(validateUser)

router.route("/").post(accessChat);
router.route("/").get(fetchChats);
router.route("/group").post(createGroupChat);
router.route("/rename").put(renameGroup);
router.route("/leave").put(leaveGroup);
router.route("/join").put(joinGroup);

export default router;
