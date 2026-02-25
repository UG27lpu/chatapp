const Chat = require("../models/chat.model");
const Thread = require("../models/thread.model");
const asyncHandler = require("../utils/asyncHandler");
const { getIO, onlineUsers } = require("../socket/socket");

//SENDMESSAGE
exports.sendMessage = asyncHandler(async (req, res) => {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
        return res.status(400).json({ message: "Missing Fields" });
    }



    //find or create thread
    let thread = await Thread.findOne({
        participants: { $all: [sender, receiver] }
    });

    if (!thread) {
        thread = await Thread.create({ participants: [sender, receiver] })
    }

    //create chat 
    const chat = await Chat.create({
        sender,
        receiver,
        message,
        thread: thread._id,
    });

    //update thread
    thread.lastMessage = message;
    thread.lastMessageTime = new Date();
    await thread.save();

    //realtime emit
    const receiverSocket = onlineUsers.get(receiver);
    if (receiverSocket) {
        getIO().to(receiverSocket).emit("new_message", chat);
    }
    res.status(201).json(chat);

});

//GET MESSAGES BY THREAD

exports.getMessages = asyncHandler(async (req, res) => {
    const { threadId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const messages = await Chat.find({ thread: threadId })
        .populate("sender", "username email")
        .populate("receiver", "username email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.json({
        success: true,
        count: messages.length,
        data: messages
    });
});

exports.markAsRead = asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const message = await Chat.findByIdAndUpdate(
        messageId,
        { isRead: true },
        { new: true }
    );

    if (!message) {
        return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({
        success: true,
        data: message
    });
});
