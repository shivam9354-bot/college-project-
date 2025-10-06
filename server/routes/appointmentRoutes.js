import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// Create appointment
router.post("/", async (req, res) => {
  const { from, to, message } = req.body;

  if (!from || !to || !message) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const appointment = new Appointment({ from, to, message });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get appointments for a specific user
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const appointments = await Appointment.find({
      $or: [{ from: userId }, { to: userId }],
    }).sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
