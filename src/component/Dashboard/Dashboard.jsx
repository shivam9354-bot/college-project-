import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../Service/api";
import "./Dashboard.cs";

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users"); // fetch all users
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="dashboard-parent">
      <h1>Dashboard</h1>
      {users.map((user) => (
        <div key={user._id} className="user-card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <div className="card-buttons">
            {/* Pass user._id in the URL */}
            <Link to={`/user/${user._id}`}>
              <button className="dashboard-btn">View Profile</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
