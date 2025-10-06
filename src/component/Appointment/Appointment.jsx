import React, { useState } from "react";
import api from "../../Service/api";

const Appointment = ({ user, onClose }) => {
  const [appointment, setAppointment] = useState("");
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const sendAppointment = async () => {
    if (!appointment) return;

    try {
      const res = await api.post("/appointments", {
        from: loggedUser._id,
        to: user._id,
        message: appointment,
      });
      alert("Appointment request sent!");
      setAppointment("");
      onClose();
    } catch (err) {
      console.error("Error sending appointment:", err);
    }
  };

  return (
    <div style={{ border: "1px solid orange", marginTop: "10px", padding: "10px" }}>
      <h3>Appointment with {user.name}</h3>
      <input
        value={appointment}
        onChange={(e) => setAppointment(e.target.value)}
        placeholder="Enter details"
      />
      <button onClick={sendAppointment}>Send</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Appointment;
