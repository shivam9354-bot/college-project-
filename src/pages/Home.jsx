import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../Service/api";
import "./Home.css"; // Make sure all your CSS is pasted here

const Home = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      setUser(loggedUser);

      // fetch appointment notifications
      const fetchAppointments = async () => {
        try {
          const res = await api.get(`/appointments/${loggedUser._id}`);
          setNotifications(res.data);
        } catch (err) {
          console.error("Error fetching appointments:", err);
        }
      };

      fetchAppointments();
    }
  }, []);

  return (
    <div className="parent">
      {/* Nav bar */}
      <div className="button-container">
        {/* Example nav buttons */}
        <button className="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 1024 1024"
            strokeWidth="0"
            fill="currentColor"
            stroke="currentColor"
            className="icon"
          >
            <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path>
          </svg>
        </button>
        <button className="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            aria-hidden="true"
            viewBox="0 0 24 24"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
            className="icon"
          >
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
        <button className="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            strokeWidth="0"
            fill="currentColor"
            stroke="currentColor"
            className="icon"
          >
            <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"></path>
          </svg>
        </button>
        <button className="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
            className="icon"
          >
            <circle r="1" cy="21" cx="9"></circle>
            <circle r="1" cy="21" cx="20"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="content">
        {!user ? (
          <>
            {/* Register button */}
            <div className="register">
              <Link to="/register">
                <button className="continue-application">
                  <div>
                    <div className="pencil"></div>
                    <div className="folder">
                      <div className="top">
                        <svg viewBox="0 0 24 27">
                          <path d="M1,0 L23,0 C23.5522847,-1.01453063e-16 24,0.44771525 24,1 L24,8.17157288 C24,8.70200585 23.7892863,9.21071368 23.4142136,9.58578644 L20.5857864,12.4142136 C20.2107137,12.7892863 20,13.2979941 20,13.8284271 L20,26 C20,26.5522847 19.5522847,27 19,27 L1,27 C0.44771525,27 6.76353751e-17,26.5522847 0,26 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z"></path>
                        </svg>
                      </div>
                      <div className="paper"></div>
                    </div>
                  </div>
                  Register
                </button>
              </Link>
            </div>

            {/* Find button */}
            <div className="find">
              <Link to="/view-members">
                <button className="reward-btn">
                  <span className="IconContainer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 60 20"
                      className="box-top box"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="4"
                        stroke="#6A8EF6"
                        d="M2 18L58 18"
                      ></path>
                      <circle
                        strokeWidth="5"
                        stroke="#6A8EF6"
                        fill="#101218"
                        r="7"
                        cy="9.5"
                        cx="20.5"
                      ></circle>
                      <circle
                        strokeWidth="5"
                        stroke="#6A8EF6"
                        fill="#101218"
                        r="7"
                        cy="9.5"
                        cx="38.5"
                      ></circle>
                    </svg>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 58 44"
                      className="box-body box"
                    >
                      <mask fill="white" id="path-1-inside-1_81_19">
                        <rect rx="3" height="44" width="58"></rect>
                      </mask>
                      <rect
                        mask="url(#path-1-inside-1_81_19)"
                        strokeWidth="8"
                        stroke="#6A8EF6"
                        fill="#101218"
                        rx="3"
                        height="44"
                        width="58"
                      ></rect>
                      <line
                        strokeWidth="6"
                        stroke="#6A8EF6"
                        y2="29"
                        x2="58"
                        y1="29"
                        x1="0"
                      ></line>
                      <path
                        strokeLinecap="round"
                        strokeWidth="5"
                        stroke="#6A8EF6"
                        d="M45 20L36 3"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeWidth="5"
                        stroke="#6A8EF6"
                        d="M21 3L13 19.999"
                      ></path>
                    </svg>

                    <span className="coin"></span>
                  </span>
                  <span className="text">Find</span>
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div>
            {/* Styled Dashboard button like Register */}
            <div className="register">
              <Link to="/dashboard">
                <button className="continue-application">
                  <div>
                    <div className="pencil"></div>
                    <div className="folder">
                      <div className="top">
                        <svg viewBox="0 0 24 27">
                          <path d="M1,0 L23,0 C23.5522847,-1.01453063e-16 24,0.44771525 24,1 L24,8.17157288 C24,8.70200585 23.7892863,9.21071368 23.4142136,9.58578644 L20.5857864,12.4142136 C20.2107137,12.7892863 20,13.2979941 20,13.8284271 L20,26 C20,26.5522847 19.5522847,27 19,27 L1,27 C0.44771525,27 6.76353751e-17,26.5522847 0,26 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z"></path>
                        </svg>
                      </div>
                      <div className="paper"></div>
                    </div>
                  </div>
                  Dashboard
                </button>
              </Link>
            </div>

            {/* Appointment notifications */}
            {notifications.length > 0 && (
              <div
                style={{
                  marginTop: "20px",
                  border: "1px solid red",
                  padding: "10px",
                }}
              >
                <h3>Appointments</h3>
                {notifications.map((n) => (
                  <p key={n._id}>
                    From <b>{n.from}</b>: {n.message}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
