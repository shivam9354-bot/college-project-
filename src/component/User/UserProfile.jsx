import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../Service/api";
import "./UserProfile.css";

const socket = io("http://localhost:5000"); // update to your backend URL

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info"); // info | chat | video

  // Chat state
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // WebRTC state
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  const room = id; // use user id as room

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  // Setup socket events
  useEffect(() => {
    socket.emit("join", { room });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data.message]);
    });

    socket.on("webrtc_offer", async (data) => {
      if (!peerConnection) {
        createPeerConnection();
      }
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("webrtc_answer", { room, answer });
    });

    socket.on("webrtc_answer", async (data) => {
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    socket.on("webrtc_ice_candidate", async (data) => {
      try {
        if (peerConnection) {
          await peerConnection.addIceCandidate(data.candidate);
        }
      } catch (e) {
        console.error("Error adding ICE candidate:", e);
      }
    });

    return () => {
      socket.emit("leave", { room });
      if (peerConnection) peerConnection.close();
    };
  }, [peerConnection]);

  const sendMessage = () => {
    if (message.trim().length > 0) {
      socket.emit("send_message", { room, message });
      setMessages((prev) => [...prev, message]);
      setMessage("");
    }
  };

  const createPeerConnection = async () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.ontrack = (event) => {
      const remoteVideo = document.getElementById("remoteVideo");
      remoteVideo.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc_ice_candidate", { room, candidate: event.candidate });
      }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      const localVideo = document.getElementById("localVideo");
      localVideo.srcObject = stream;

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }

    setPeerConnection(pc);
    return pc;
  };

  const startCall = async () => {
    const pc = await createPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("webrtc_offer", { room, offer });
  };

  if (loading) return <p>Loading user...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="userprofile-container">
      <h2>{user.name}'s Profile</h2>

      <div className="userprofile-buttons">
        <button onClick={() => setActiveTab("info")}>View Info</button>
        <button onClick={() => setActiveTab("chat")}>Chat</button>
        <button onClick={() => setActiveTab("video")}>Video Call</button>
      </div>

      {/* Info Section */}
      {activeTab === "info" && (
        <div className="info-section">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}

      {/* Chat Section */}
      {activeTab === "chat" && (
        <div className="chat-section">
          <div id="chat-window">
            {messages.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
          <input
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message here"
          />
          <button id="sendBtn" onClick={sendMessage}>
            Send
          </button>
        </div>
      )}

      {/* Video Call Section */}
      {activeTab === "video" && (
        <div className="video-section">
          <button id="startCall" onClick={startCall}>
            Start Video Call
          </button>
          <div id="videos">
            <video id="localVideo" autoPlay muted></video>
            <video id="remoteVideo" autoPlay></video>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
