import React, { useState, useEffect, useRef } from 'react';

const WHLvideolist = ({ videolist, currentuser, page }) => {
  const [quality, setQuality] = useState('720p');
  const [watchedVideos, setWatchedVideos] = useState(() => {
    // Load watched videos from localStorage or empty
    return JSON.parse(localStorage.getItem('watchedVideos') || '{}');
  });
  const [downloadCountToday, setDownloadCountToday] = useState(() => {
    const data = JSON.parse(localStorage.getItem('downloadData') || '{}');
    if (data.date === new Date().toDateString()) return data.count;
    return 0;
  });

  // Watch time limits per plan in seconds
  const planLimits = {
    Free: 5 * 60,
    Bronze: 7 * 60,
    Silver: 10 * 60,
    Gold: Infinity,
  };
  const watchTimeLimit = planLimits[currentuser?.plan] || planLimits.Free;

  // Track cumulative watch time per user in seconds (can improve with backend)
  const [watchTime, setWatchTime] = useState(0);
  const watchTimeRef = useRef(0);
  const videoRefs = useRef({}); // To track multiple video timers

  // Handle video play start
  const handlePlay = (videoId) => {
    if (watchTimeRef.current >= watchTimeLimit) {
      alert(`Your watch time limit of ${watchTimeLimit / 60} minutes is reached. Upgrade your plan!`);
      // Pause all videos or current video
      if (videoRefs.current[videoId]) {
        videoRefs.current[videoId].pause();
      }
      return;
    }

    // Start tracking watch time for this video
    if (!videoRefs.current[videoId]) {
      videoRefs.current[videoId] = document.getElementById(`video-${videoId}`);
    }

    if (!watchedVideos[videoId]) {
      // Allocate points once per video
      const newPoints = ((Object.keys(watchedVideos).length + 1) * 5);
      console.log(`User earned ${newPoints} points for video ${videoId}`);

      const updated = { ...watchedVideos, [videoId]: true };
      setWatchedVideos(updated);
      localStorage.setItem('watchedVideos', JSON.stringify(updated));
      // Here you can call your API or redux to update points
    }
  };

  // Track watch time every second when video is playing
  const handleTimeUpdate = (videoId) => {
    if (watchTimeRef.current >= watchTimeLimit) {
      if (videoRefs.current[videoId]) {
        videoRefs.current[videoId].pause();
      }
      alert(`Watch time limit reached! Upgrade your plan.`);
      return;
    }

    setWatchTime((prev) => {
      const newTime = prev + 1;
      watchTimeRef.current = newTime;
      return newTime;
    });
  };

  // Download logic with daily limit
  const handleDownload = (video) => {
    const isPremium = currentuser?.plan === "Gold" || currentuser?.plan === "Silver" || currentuser?.plan === "Bronze";
    const today = new Date().toDateString();

    const downloadData = JSON.parse(localStorage.getItem('downloadData') || '{}');
    if (downloadData.date === today) {
      if (!isPremium && downloadData.count >= 1) {
        alert("You can only download 1 video per day. Upgrade your plan.");
        return;
      }
      downloadData.count += 1;
    } else {
      downloadData.date = today;
      downloadData.count = 1;
    }

    localStorage.setItem('downloadData', JSON.stringify(downloadData));
    setDownloadCountToday(downloadData.count);

    // Trigger download
    const link = document.createElement('a');
    link.href = video.video_src;
    link.download = `${video.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Gesture control handler example
  const handleGesture = (e, videoId) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within video element
    const width = rect.width;

    // Detect taps count and location on video element
    if (e.detail === 2) {
      // Double tap
      if (x < width / 3) {
        // Left side double tap - rewind 10 sec
        videoRefs.current[videoId].currentTime = Math.max(0, videoRefs.current[videoId].currentTime - 10);
      } else if (x > (2 * width) / 3) {
        // Right side double tap - forward 10 sec
        videoRefs.current[videoId].currentTime = Math.min(videoRefs.current[videoId].duration, videoRefs.current[videoId].currentTime + 10);
      }
    } else if (e.detail === 1) {
      // Single tap middle - pause/play toggle
      if (x > width / 3 && x < (2 * width) / 3) {
        if (videoRefs.current[videoId].paused) {
          videoRefs.current[videoId].play();
        } else {
          videoRefs.current[videoId].pause();
        }
      }
    } else if (e.detail === 3) {
      // Triple tap
      if (x < width / 3) {
        alert("Triple tap left: Show comment section");
        // Add your logic here
      } else if (x > (2 * width) / 3) {
        alert("Triple tap right: Close website");
        // Add your logic here - window.close() doesn't work in most browsers
      } else {
        alert("Triple tap middle: Next video");
        // Add your logic here
      }
    }
  };

  if (!videolist || videolist.length === 0) {
    return <p>No videos available</p>;
  }

  return (
    <div className="video-grid">
      {videolist.map((video) => (
        <div key={video._id} className="video-item">
          <h3>{video.title}</h3>

          <video
            id={`video-${video._id}`}
            width="320"
            height="240"
            controls
            onPlay={() => handlePlay(video._id)}
            onTimeUpdate={() => handleTimeUpdate(video._id)}
            onClick={(e) => handleGesture(e, video._id)}
          >
            <source src={`http://localhost:5000/api/video/${video._id}-${quality}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div style={{ margin: '5px 0' }}>
            <label>Quality: </label>
            <select onChange={(e) => setQuality(e.target.value)} value={quality}>
              <option value="320p">320p</option>
              <option value="480p">480p</option>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>
          </div>

          <p>{video.description}</p>

          <button onClick={() => handleDownload(video)} style={{ marginTop: '5px' }}>
            Download
          </button>
        </div>
      ))}
    </div>
  );
};

export default WHLvideolist;
