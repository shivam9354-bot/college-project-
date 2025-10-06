import React, { useState, useEffect } from "react";
import { updateUser } from "../../Service/api";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const navigate = useNavigate();

  // read localStorage once
  const savedProfile = JSON.parse(localStorage.getItem("profile") || "{}");

  const [form, setForm] = useState({
    name: savedProfile.name || "",
    email: savedProfile.email || "",
    password: "",
    role: savedProfile.role || "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateUser(savedProfile._id, form);
      localStorage.setItem("profile", JSON.stringify(data));
      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Update Your profile</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", maxWidth: 400 }}
      >
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="New Password (leave blank to keep current)"
            value={form.password}
            onChange={handleChange}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={togglePassword}
            style={{ marginLeft: 5 }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={{ marginTop: 10 }}
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="principal">Principal</option>
        </select>

        <button type="submit" style={{ marginTop: 10 }}>
          Update
        </button>
      </form>
    </div>
  );
}
