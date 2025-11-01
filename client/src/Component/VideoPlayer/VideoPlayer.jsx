import React, { useRef, useState, useEffect } from "react";
import "./VideoPlayer.css";

const planLimits = {
  free: 5 * 60,
  bronze: 7 * 60,
  silver: 10 * 60,
  gold: Infinity,
};

const VideoPlayer = ({ videoSrc, title, description, userPlan = "free" }) => {
  const videoRef = useRef(null);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [selectedLang, setSelectedLang] = useState("en");
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [downloadsToday, setDownloadsToday] = useState(
    Number(localStorage.getItem("downloadsToday")) || 0
  );

  // Video-level likes/dislikes
  const [videoReaction, setVideoReaction] = useState({ likes: 0, dislikes: 0, userReaction: null });

  const maxWatchTime = planLimits[userPlan.toLowerCase()] ?? planLimits.free;

  // Timer for plan restriction
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let interval = null;
    const startTimer = () => {
      if (interval) return;
      interval = setInterval(() => {
        setWatchedSeconds((prev) => {
          if (!video) return prev;
          if (prev + 1 >= maxWatchTime) {
            video.pause();
            alert(
              `Your ${userPlan} plan allows only ${maxWatchTime / 60} minutes. Upgrade to watch more.`
            );
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    };

    const stopTimer = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    video.addEventListener("play", startTimer);
    video.addEventListener("pause", stopTimer);
    video.addEventListener("ended", stopTimer);

    return () => {
      stopTimer();
      video.removeEventListener("play", startTimer);
      video.removeEventListener("pause", stopTimer);
      video.removeEventListener("ended", stopTimer);
    };
  }, [userPlan, maxWatchTime]);

  // Download video with daily limit
  const handleDownload = () => {
    if (userPlan.toLowerCase() === "free" && downloadsToday >= 1) {
      setShowPremiumPopup(true);
      return;
    }

    const link = document.createElement("a");
    link.href = videoSrc;
    link.download = title ? `${title}.mp4` : "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const newCount = downloadsToday + 1;
    setDownloadsToday(newCount);
    localStorage.setItem("downloadsToday", newCount);
  };

  // Comment actions
  const addComment = () => {
    if (!newComment.trim()) return;
    const newCommentObj = {
      id: Date.now(),
      text: newComment,
      likes: 0,
      dislikes: 0,
      userReaction: null,
    };
    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  const toggleReaction = (id, type) => {
    if (id === "video") {
      // Video-level reactions
      setVideoReaction((prev) => {
        let { likes, dislikes, userReaction } = prev;
        if (type === "like") {
          if (userReaction === "like") {
            likes -= 1;
            userReaction = null;
          } else {
            likes += 1;
            if (userReaction === "dislike") dislikes -= 1;
            userReaction = "like";
          }
        } else if (type === "dislike") {
          if (userReaction === "dislike") {
            dislikes -= 1;
            userReaction = null;
          } else {
            dislikes += 1;
            if (userReaction === "like") likes -= 1;
            userReaction = "dislike";
          }
        }
        return { likes, dislikes, userReaction };
      });
      return;
    }

    // Comment-level reactions
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        let likes = c.likes;
        let dislikes = c.dislikes;
        let reaction = c.userReaction;

        if (type === "like") {
          if (reaction === "like") {
            likes -= 1;
            reaction = null;
          } else {
            likes += 1;
            if (reaction === "dislike") dislikes -= 1;
            reaction = "like";
          }
        } else if (type === "dislike") {
          if (reaction === "dislike") {
            dislikes -= 1;
            reaction = null;
          } else {
            dislikes += 1;
            if (reaction === "like") likes -= 1;
            reaction = "dislike";
          }
        }
        return { ...c, likes, dislikes, userReaction: reaction };
      })
    );
  };

  // Translate comment
  const handleTranslate = async (id, text) => {
    if (!text.trim()) return;
    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${selectedLang}&dt=t&q=${encodeURIComponent(
          text
        )}`
      );
      const data = await res.json();
      const translated = data?.[0]?.[0]?.[0] || "";
      setTranslatedTexts((prev) => ({ ...prev, [id]: translated }));
    } catch (err) {
      console.error(err);
      alert("Translation failed");
    }
  };

  return (
    <div className="video-player-container">
      <video ref={videoRef} src={videoSrc} controls />

      {/* Video Info */}
      <div className="video-info">
        <h3>{title}</h3>
        <p>{description}</p>

        {/* Video Actions */}
        <div className="video-actions">
          <button onClick={handleDownload} className="download-btn">⬇ Download</button>
          <button onClick={() => alert("Share link copied!")} className="share-btn">🔗 Share</button>
          <button className={videoReaction.userReaction === "like" ? "like-btn active" : "like-btn"} 
                  onClick={() => toggleReaction("video", "like")}>
            👍 {videoReaction.likes}
          </button>
          <button className={videoReaction.userReaction === "dislike" ? "dislike-btn active" : "dislike-btn"} 
                  onClick={() => toggleReaction("video", "dislike")}>
            👎 {videoReaction.dislikes}
          </button>
          <button className="subscribe-btn" onClick={() => alert("Subscribed!")}>🔔 Subscribe</button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h4>Comments</h4>
        <div className="comment-input-container">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="ta">Tamil</option>
            <option value="hi">Hindi</option>
          </select>
          <button onClick={addComment}>Post</button>
        </div>

        <ul className="comments-list">
          {comments.map(({ id, text, likes, dislikes, userReaction }) => (
            <li key={id} className="comment-item">
              <p className="comment-text">
                {text}{" "}
                {translatedTexts[id] && (
                  <span className="translated-text">{translatedTexts[id]}</span>
                )}
              </p>
              <div className="reaction-buttons">
                <button className={userReaction === "like" ? "active" : ""} onClick={() => toggleReaction(id, "like")}>
                  👍 {likes}
                </button>
                <button className={userReaction === "dislike" ? "active" : ""} onClick={() => toggleReaction(id, "dislike")}>
                  👎 {dislikes}
                </button>
                <button onClick={() => handleTranslate(id, text)}>🌐 Translate</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Premium Popup */}
      {showPremiumPopup && (
        <div className="premium-popup">
          <div className="popup-content">
            <h3>Upgrade to Premium</h3>
            <p>Free users can download only 1 video per day. Get premium to download unlimited videos.</p>
            <button onClick={() => (window.location.href = "/subscriptionplans")}>
              Go to Premium
            </button>
            <button className="close-btn" onClick={() => setShowPremiumPopup(false)}>
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
