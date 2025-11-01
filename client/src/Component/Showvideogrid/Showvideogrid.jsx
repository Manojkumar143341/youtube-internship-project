import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Showvideogrid.css'; // optional CSS if needed

const Showvideogrid = ({ vid }) => {
  const user = useSelector((state) => state.authReducer?.authData); // Get current user from Redux
  const token = localStorage.getItem('token');

  const [watchedVideos, setWatchedVideos] = useState({});

  if (!vid || vid.length === 0) {
    return <p>No videos available</p>;
  }

  const handleVideoEnd = async (videoId) => {
    if (!watchedVideos[videoId]) {
      try {
        await axios.post(
          'http://localhost:5000/api/users/updatePoints',
          { userId: user._id, points: 5 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Mark as watched
        setWatchedVideos((prev) => ({
          ...prev,
          [videoId]: true,
        }));

        console.log("✅ Points added for watching:", videoId);
      } catch (error) {
        console.error("❌ Failed to update points:", error);
      }
    }
  };

  return (
    <div className="video-grid">
      <div className="plan-banner">
        <p>
          You are on <strong>{user?.subscriptionType || 'Free Plan'}</strong>. Watch videos and earn points!
        </p>
      </div>

      {vid.map((video) => (
        <div key={video._id} className="video-item">
          <h3>{video.videotitle || video.title}</h3>

          <video
            width="320"
            height="240"
            controls
            onEnded={() => handleVideoEnd(video._id)}
          >
            {video.sources ? (
              video.sources.map((source) => (
                <source key={source.quality} src={source.src} type="video/mp4" />
              ))
            ) : (
              <source src={video.video_src || video.filepath} type="video/mp4" />
            )}
            Your browser does not support the video tag.
          </video>

          <p>{video.description || video.videodescription}</p>
        </div>
      ))}
    </div>
  );
};

export default Showvideogrid;
