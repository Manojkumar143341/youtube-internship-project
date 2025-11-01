import React, { useState } from 'react';
import './Comment.css';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { editcomment, deletecomment, dislikeComment, likecomment } from '../../action/comment';
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { AiOutlineTranslation } from "react-icons/ai";

const Displaycomment = ({ cid, commentbody, userid, commenton, usercommented, likesCount, dislikesCount }) => {
  const [edit, setEdit] = useState(false);
  const [cmtnody, setCommentbdy] = useState("");
  const [translated, setTranslated] = useState(false);
  const [translatedContent, setTranslatedContent] = useState("");
  const [likes, setLikes] = useState(likesCount || 0);
  const [dislikes, setDislikes] = useState(dislikesCount || 0);

  const dispatch = useDispatch();
  const currentuser = useSelector(state => state.currentuserreducer);

  // Start editing
  const handleEdit = (ctid, ctbdy) => {
    setEdit(true);
    setCommentbdy(ctbdy);
  };

  // Submit edited comment
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!cmtnody.trim()) {
      alert("Type your comment");
      return;
    }
    dispatch(editcomment({ id: cid, commentbody: cmtnody }));
    setEdit(false);
  };

  // Delete comment
  const handleDel = () => {
    if(window.confirm("Are you sure you want to delete this comment?")) {
      dispatch(deletecomment(cid));
    }
  };

  // Like comment
  const handleLike = () => {
    dispatch(likecomment(cid))
      .then(() => setLikes(prev => prev + 1))
      .catch(console.error);
  };

  // Dislike comment with auto-delete if dislikes >= 2
  const handleDislike = () => {
    dispatch(dislikeComment(cid))
      .then(() => {
        const updatedDislikes = dislikes + 1;
        setDislikes(updatedDislikes);
        if (updatedDislikes >= 2) {
          dispatch(deletecomment(cid));
        }
      })
      .catch(console.error);
  };

  // Translate comment using Google Translate
  const handleTranslate = async () => {
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(commentbody)}`);
      const data = await res.json();
      if (data && data[0] && data[0][0]) {
        setTranslatedContent(data[0][0][0]);
        setTranslated(true);
      }
    } catch (error) {
      console.error("Translation failed", error);
      alert("Translation service unavailable");
    }
  };

  const toggleTranslation = () => setTranslated(prev => !prev);

  return (
    <div className="comment-box">
      {edit ? (
        <form className="comments_sub_form_comments" onSubmit={handleOnSubmit}>
          <input
            type="text"
            onChange={(e) => setCommentbdy(e.target.value)}
            placeholder='Edit comment...'
            value={cmtnody}
            className="comment_ibox"
          />
          <input type="submit" value="Change" className="comment_add_btn_comments" />
          <button type="button" onClick={() => setEdit(false)} className="comment_cancel_btn">Cancel</button>
        </form>
      ) : (
        <>
          <p className="comment_body">{translated ? translatedContent : commentbody}</p>
          <p className="usercommented">- {usercommented} commented {moment(commenton).fromNow()}</p>
        </>
      )}

      {!edit && (
        <div className="comment-actions">
          <button onClick={handleLike}><FaThumbsUp /> {likes}</button>
          <button onClick={handleDislike}><FaThumbsDown /> {dislikes}</button>
          <button onClick={translated ? toggleTranslation : handleTranslate}>
            <AiOutlineTranslation /> {translated ? "Show Original" : "Translate"}
          </button>
        </div>
      )}

      {currentuser?.result?._id === userid && !edit && (
        <p className="EditDel_DisplayCommendt">
          <i onClick={() => handleEdit(cid, commentbody)}>Edit</i>
          <i onClick={handleDel}>Delete</i>
        </p>
      )}
    </div>
  );
};

export default Displaycomment;
