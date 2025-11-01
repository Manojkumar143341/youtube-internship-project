import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

// Signaling server URL
const SOCKET_SERVER_URL = "http://localhost:5000";

const VoIPCall = () => {
  const [callActive, setCallActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const socketRef = useRef();
  const peerConnectionRef = useRef();
  const localStreamRef = useRef();
  const remoteStreamRef = useRef();

  // Default room & user (later can come from params or Redux)
  const roomId = "room1";
  const userId = `user_${Math.floor(Math.random() * 10000)}`;

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.emit("join-room", roomId, userId);

    socketRef.current.on("offer", handleReceiveOffer);
    socketRef.current.on("answer", handleReceiveAnswer);
    socketRef.current.on("ice-candidate", handleNewICECandidateMsg);

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, userId]);

  const startCall = async () => {
    peerConnectionRef.current = new RTCPeerConnection(servers);
    peerConnectionRef.current.onicecandidate = handleICECandidateEvent;
    peerConnectionRef.current.ontrack = handleTrackEvent;

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = localStream;
      localVideoRef.current.srcObject = localStream;

      localStream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, localStream);
      });

      setCallActive(true);

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socketRef.current.emit("offer", roomId, offer);
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  };

  const handleReceiveOffer = async (offer) => {
    if (!peerConnectionRef.current) {
      peerConnectionRef.current = new RTCPeerConnection(servers);
      peerConnectionRef.current.onicecandidate = handleICECandidateEvent;
      peerConnectionRef.current.ontrack = handleTrackEvent;
    }

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = localStream;
      localVideoRef.current.srcObject = localStream;

      localStream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, localStream);
      });

      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      socketRef.current.emit("answer", roomId, answer);
      setCallActive(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReceiveAnswer = async (answer) => {
    if (!peerConnectionRef.current) return;
    await peerConnectionRef.current.setRemoteDescription(answer);
  };

  const handleICECandidateEvent = (event) => {
    if (event.candidate) {
      socketRef.current.emit("ice-candidate", roomId, event.candidate);
    }
  };

  const handleNewICECandidateMsg = async (candidate) => {
    try {
      await peerConnectionRef.current.addIceCandidate(candidate);
    } catch (e) {
      console.error("Error adding received ice candidate", e);
    }
  };

  const handleTrackEvent = (event) => {
    if (remoteVideoRef.current) {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
      remoteStreamRef.current.addTrack(event.track);
    }
  };

  // Screen sharing
  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const sender = peerConnectionRef.current
        .getSenders()
        .find((s) => s.track.kind === "video");
      sender.replaceTrack(screenStream.getVideoTracks()[0]);

      screenStream.getVideoTracks()[0].onended = async () => {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        sender.replaceTrack(cameraStream.getVideoTracks()[0]);
        localVideoRef.current.srcObject = cameraStream;
        localStreamRef.current = cameraStream;
      };
      localVideoRef.current.srcObject = screenStream;
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };

  // Recording
  const startRecording = () => {
    if (!localStreamRef.current || !remoteStreamRef.current) {
      alert("Streams not ready for recording");
      return;
    }

    const combinedStream = new MediaStream([
      ...localStreamRef.current.getTracks(),
      ...remoteStreamRef.current.getTracks(),
    ]);

    const recorder = new MediaRecorder(combinedStream);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setRecordedChunks((prev) => [...prev, e.data]);
      }
    };
    recorder.start();

    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  // Save recording
  useEffect(() => {
    if (!recording && recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `recorded_call_${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recording, recordedChunks]);

  return (
    <div>
      <h2>Video Call Room: {roomId}</h2>

      <div>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={{ width: "200px" }}
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: "200px" }}
        />
      </div>

      {!callActive ? (
        <button onClick={startCall}>Start Call</button>
      ) : (
        <>
          <button onClick={shareScreen}>Share Screen</button>
          {!recording ? (
            <button onClick={startRecording}>Start Recording</button>
          ) : (
            <button onClick={stopRecording}>Stop Recording</button>
          )}
        </>
      )}
    </div>
  );
};

export default VoIPCall;
