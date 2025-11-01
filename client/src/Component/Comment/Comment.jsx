import React, { useState, useEffect } from "react";
import axios from "axios";
 // reuse Home.css for styling

const Comment = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedLang, setSelectedLang] = useState("en");
  const [translatedText, setTranslatedText] = useState("");
  const token = localStorage.getItem("token");

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/comment/get?videoid=${videoId}`
      );
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const toggleCommentInput = () => {
    setShowCommentInput((prev) => !prev);
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    try {
      await axios.post(
        "http://localhost:5000/comment/post",
        { videoid: videoId, text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText("");
      setTranslatedText("");
      setShowCommentInput(false);
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleTranslate = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${selectedLang}&dt=t&q=${encodeURIComponent(commentText)}`
      );
      const data = await res.json();
      if (data && data[0] && data[0][0]) {
        setTranslatedText(data[0][0][0]);
      }
    } catch (error) {
      console.error("Translation failed:", error);
      alert("Translation service unavailable");
    }
  };

  return (
    <div className="comment-section">
      <h3>Comment</h3>

      <button className="toggle-comments-btn" onClick={toggleCommentInput}>
        {showCommentInput ? "Hide Comment Box" : "Show Comment Box"}
      </button>

      {showCommentInput && (
        <div className="small-comment-box">
          <textarea
            placeholder="Write your comment..."
            value={translatedText || commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="small-comment-input"
          />

          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="small-comment-lang-select"
          >
            <option value="en">English</option>
            <option value="ta">Tamil</option>
            <option value="hi">Hindi</option>
          </select>

          <div className="small-comment-buttons">
            <button
              onClick={handleTranslate}
              className="small-comment-translate-btn"
            >
              Translate
            </button>
            <button
              onClick={handlePostComment}
              className="small-comment-post-btn"
            >
              Post
            </button>
          </div>
        </div>
      )}

      <div className="comment-list">
        {comments.map((c) => (
          <div key={c._id} className="comment-card">
            <p>
              <strong>Original:</strong> {c.text}
            </p>
            <small className="comment-city">From: {c.city || "Unknown"}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;
