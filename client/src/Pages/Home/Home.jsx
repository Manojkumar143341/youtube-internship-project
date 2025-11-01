import React, { useState } from "react";
import { useSelector } from "react-redux";
import Leftsidebar from "../../Component/Leftsidebar/Leftsidebar";
import Showvideogrid from "../../Component/Showvideogrid/Showvideogrid";
import VideoPlayer from "../../Component/VideoPlayer/VideoPlayer";
import fallbackVideo from "../../Component/Video/vid.mp4";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();

  const reduxVids = useSelector((state) => state.videoReducer?.data || []);
  const reversedVids = [...reduxVids].reverse();
  const firstVideo = reversedVids.length > 0 ? reversedVids[0] : null;
  const firstVideoSrc = firstVideo ? firstVideo.videoUrl : fallbackVideo;

  const toggleCommentInput = () => {
    setShowCommentInput((prev) => !prev);
  };

  const handlePostComment = () => {
    if (commentText.trim() === "") return;
    // TODO: call your API to post comment here
    alert(`Posted comment: ${commentText}`);
    setCommentText("");
    setShowCommentInput(false);
  };

  return (
    <div className="container_Pages_App">
      <Leftsidebar />

      <div className="container2_Pages_App">
        <div className="video-player-section">
          <VideoPlayer videoSrc={firstVideoSrc} />

         

          {showCommentInput && (
            <div className="small-comment-box">
              <input
                type="text"
                placeholder="Write your comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="small-comment-input"
              />
              <button
                onClick={handlePostComment}
                className="small-comment-post-btn"
              >
                Post
              </button>
            </div>
          )}

        </div>

        <div className="video-grid-section">
          {reversedVids.length > 0 ? (
            <Showvideogrid videos={reversedVids} />
          ) : (
            <p>No videos found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
