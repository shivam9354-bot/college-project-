import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // backend server URL

const Chatbox = ({ user, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isVideo, setIsVideo] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);

  const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  // Join a private room between current user & selected user
  const room = `room-${user._id}`;

  useEffect(() => {
    socket.emit("join", { room });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { sender: "Them", text: data.message }]);
    });

    // WebRTC Handlers
    socket.on("webrtc_offer", async (data) => {
      if (!peerConnection.current) startPeer();
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("webrtc_answer", { room, answer });
    });

    socket.on("webrtc_answer", async (data) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    socket.on("webrtc_ice_candidate", async (data) => {
      try {
        await peerConnection.current.addIceCandidate(data.candidate);
      } catch (e) {
        console.error("Error adding ice candidate", e);
      }
    });

    return () => {
      socket.emit("leave", { room });
      if (peerConnection.current) peerConnection.current.close();
    };
  }, [room]);

  const sendMessage = () => {
    if (!message) return;
    socket.emit("send_message", { room, message });
    setMessages((prev) => [...prev, { sender: "Me", text: message }]);
    setMessage("");
  };

  const startPeer = async () => {
    peerConnection.current = new RTCPeerConnection(configuration);

    localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = localStream.current;

    localStream.current.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream.current);
    });

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc_ice_candidate", { room, candidate: event.candidate });
      }
    };
  };

  const startCall = async () => {
    await startPeer();
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("webrtc_offer", { room, offer });
  };

  return (
    <div style={{ border: "1px solid green", marginTop: "10px", padding: "10px" }}>
      <h3>Chat with {user.name}</h3>
      <div>
        <button onClick={() => setIsVideo(false)}>💬 Chat</button>
        <button onClick={() => setIsVideo(true)}>📹 Video Call</button>
        <button onClick={onClose}>Close</button>
      </div>

      {/* Chat Section */}
      {!isVideo && (
        <div>
          <div
            style={{
              height: "200px",
              overflowY: "auto",
              border: "1px solid #ccc",
              marginBottom: "10px",
              padding: "5px",
              background: "#f9f9f9",
            }}
          >
            {messages.map((m, i) => (
              <div key={i}>
                <strong>{m.sender}: </strong> {m.text}
              </div>
            ))}
          </div>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}

      {/* Video Call Section */}
      {isVideo && (
        <div>
          <button onClick={startCall}>Start Call</button>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <video ref={localVideoRef} autoPlay muted style={{ width: "200px", background: "black" }} />
            <video ref={remoteVideoRef} autoPlay style={{ width: "200px", background: "black" }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
