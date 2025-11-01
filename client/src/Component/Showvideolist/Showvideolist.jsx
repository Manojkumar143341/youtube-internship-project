import React, { useEffect, useState, useRef } from 'react';
import Showvideo from "../Showvideo/Showvideo";
import { useSelector, useDispatch } from 'react-redux';
import { updateUserPoints } from '../../action/userActions'; // hypothetical action to update points
import { useNavigate } from 'react-router-dom';

const Showvideolist = ({ videoid }) => {
  const vids = useSelector(state => state.videoreducer?.data || []);
  const currentUser = useSelector(state => state.currentuserreducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [pointsAdded, setPointsAdded] = useState(0);
  const [watchTime, setWatchTime] = useState(0); // seconds watched for current video
  const [videoQuality, setVideoQuality] = useState("720p"); // default quality, extendable
  const videoRef = useRef(null);

  // Map plan to max watch time (seconds)
  const planLimits = {
    free: 5 * 60,
    bronze: 7 * 60,
    silver: 10 * 60,
    gold: Infinity,
  };

  const userPlan = currentUser?.result?.plan || 'free';
  const maxWatchTime = planLimits[userPlan] || planLimits.free;

  // Update points on video play
  useEffect(() => {
    if (!videoid || !currentUser) return;
    // Award 5 points per video watched (if not already added for this video)
    // For demo, assume pointsAdded tracks total points for this component session
    if (pointsAdded < 5) {
      dispatch(updateUserPoints(5));
      setPointsAdded(5);
    }
  }, [videoid, currentUser, dispatch, pointsAdded]);

  // Monitor watch time and stop video if exceeds plan limit
  useEffect(() => {
    if (!videoRef.current) return;

    const videoElement = videoRef.current;

    const interval = setInterval(() => {
      if (!videoElement.paused) {
        setWatchTime(prev => {
          if (prev + 1 >= maxWatchTime) {
            videoElement.pause();
            alert(`Your ${userPlan} plan limits videos to ${maxWatchTime / 60} minutes.`);
          }
          return Math.min(prev + 1, maxWatchTime);
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [maxWatchTime, userPlan]);

  // Function to change video quality - this is a simple example assuming multiple sources available
  const handleQualityChange = (quality) => {
    setVideoQuality(quality);
  };

  // Find the video details
  const video = vids.find(v => v._id === videoid);

  if (!video) return <p>No video found</p>;

  // Map videoQuality to filepaths, example structure expected
  const qualitySrcMap = {
    "320p": video.filepath320 || video.filepath,
    "480p": video.filepath480 || video.filepath,
    "720p": video.filepath720 || video.filepath,
    "1080p": video.filepath1080 || video.filepath,
  };

  return (
    <div className="Container_ShowVideoGrid">
      <div className="video_box_app">
        {/* Pass down quality video src */}
        <video
          ref={videoRef}
          src={`http://localhost:5000/${qualitySrcMap[videoQuality]}`}
          controls
          width="720"
          height="405"
        />
        {/* Quality selector UI */}
        <div style={{ marginTop: '10px' }}>
          {["320p", "480p", "720p", "1080p"].map(q => (
            <button
              key={q}
              onClick={() => handleQualityChange(q)}
              style={{ fontWeight: q === videoQuality ? 'bold' : 'normal', marginRight: '10px' }}
            >
              {q}
            </button>
          ))}
        </div>
        {/* Showvideo component for description and details */}
        <Showvideo vid={video} />
      </div>
    </div>
  );
};

export default Showvideolist;
