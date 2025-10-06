import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate for redirect
import "./Register.css"; // make sure this file has the updated scoped CSS
import api from "../../Service/api";

const Register = () => {
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [email, setEmail] = useState("");
  const [Projectname, setProjectName] = useState("");
  const [aboutyourproject, setAboutYourProject] = useState("");
  const [role, setRole] = useState(""); // Teacher or Student
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !Projectname || !aboutyourproject ||  !role) {
      setMessage("All fields are required");
      return;
    }

    try {
      const res = await api.post("/users/register", { name, email, Projectname , aboutyourproject, role });

      // Save user info to localStorage
      localStorage.setItem("token", res.data.token); // if backend returns token
      localStorage.setItem("user", JSON.stringify(res.data.user)); // save user info

      setMessage("Registration successful!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("");

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-parent">
      <div className="register-container">
        <div className="register-form_area">
          <p className="register-title">Register now </p>
          <form onSubmit={handleSubmit}>
            <div className="register-form_group">
              <label className="register-sub_title" htmlFor="name">Name</label>
              <input
                placeholder="Enter your full name"
                className="register-form_style"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
             <div className="register-form_group">
              <label className="register-sub_title" htmlFor="Branch">Branch </label>
              <input
                placeholder="Enter your branch"
                className="register-form_style"
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>

            <div className="register-form_group">
              <label className="register-sub_title" htmlFor="email">Email</label>
              <input
                placeholder="Enter your email"
                className="register-form_style"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="register-form_group">
              <label className="register-sub_title" htmlFor="Projectname">Project name </label>
              <input
                placeholder="Tell the name of your project "
                className="register-form_style"
                type="text"
                value={Projectname}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
             <div className="register-form_group">
              <label className="register-sub_title" htmlFor="About your project">About your project </label>
              <input
                placeholder="Tell me about your  project "
                className="register-form_style"
                type="text"
                value={aboutyourproject}
                onChange={(e) => setAboutYourProject(e.target.value)}
              />
            </div>

            <div className="register-uiverse-pixel-radio-group">
              <label className="register-uiverse-pixel-radio">
                <input
                  type="radio"
                  name="role"
                  value="Teacher"
                  checked={role === "Teacher"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span className="label-text">Teacher</span>
              </label>

              <label className="register-uiverse-pixel-radio">
                <input
                  type="radio"
                  name="role"
                  value="Student"
                  checked={role === "Student"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span className="label-text">Student</span>
              </label>
            </div>

            <div>
              <button type="submit" className="register-btn">Register</button>
              {message && (
                <p style={{ color: role ? "green" : "red", marginTop: "10px" }}>
                  {message}
                </p>
              )}
              <p>
                Have an Account? <Link className="register-link" to="/login">Login Here!</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
