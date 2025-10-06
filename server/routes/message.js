import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// Get all messages between two users
router.get("/:id", async (req, res) => {
  try {
    const myId = req.headers["userid"]; // logged in user ID passed in request headers
    const otherId = req.params.id;

    if (!myId) return res.status(400).json({ error: "Missing user id in headers" });

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherId },
        { senderId: otherId, receiverId: myId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Send a message
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ error: "All fields required" });
    }

    const message = new Message({ senderId, receiverId, text });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
