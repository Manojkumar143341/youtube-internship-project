import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Download.css";

const Download = () => {
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const profile = JSON.parse(localStorage.getItem("Profile"));
        const token = profile?.token;
        const res = await axios.get("/api/downloads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDownloads(res.data);
      } catch (err) {
        console.error("Failed to fetch downloaded videos:", err);
      }
    };
    fetchDownloads();
  }, []);

  return (
    <div className="download-page">
      <h2>Downloaded Videos</h2>
      {downloads.length === 0 ? (
        <p>No downloads yet.</p>
      ) : (
        <div className="download-grid">
          {downloads.map((video) => (
            <div key={video._id} className="download-card">
              <video controls width="300">
                <source
                  src={`http://localhost:5000/downloads/${video.fileName}`}
                  type="video/mp4"
                />
              </video>
              <p>{video.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Download;
