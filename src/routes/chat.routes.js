const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");

router.post("/send", chatController.sendMessage);
router.get("/:threadId", chatController.getMessages);
router.patch("/read/:messageId", chatController.markAsRead);

module.exports = router;