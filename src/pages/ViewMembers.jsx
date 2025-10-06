import React, { useEffect, useState } from "react";
import api from "../Service/api";

const ViewMembers = () => {
  const [users, setUsers] = useState([]);
  const [viewUser, setViewUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Members</h1>
      {users.map(user => (
        <div key={user._id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <p>Name: {user.name}</p>
          <p>Role: {user.role}</p>
          <button onClick={() => setViewUser(user)}>View Info</button>
        </div>
      ))}

      {viewUser && (
        <div style={{ border: "1px solid blue", marginTop: "10px", padding: "10px" }}>
          <h3>Info for {viewUser.name}</h3>
          <p>Email: {viewUser.email}</p>
          <p>Role: {viewUser.role}</p>
          <button onClick={() => setViewUser(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ViewMembers;
