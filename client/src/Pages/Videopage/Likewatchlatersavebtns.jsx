import React, { useEffect, useState } from 'react';
import {
  BsThreeDots
} from "react-icons/bs";
import {
  AiFillDislike, AiFillLike,
  AiOutlineDislike, AiOutlineLike
} from "react-icons/ai";
import {
  MdPlaylistAddCheck
} from "react-icons/md";
import {
  RiHeartAddFill, RiPlayListAddFill, RiShareForwardLine
} from "react-icons/ri";
import "./Likewatchlatersavebtn.css";
import { useSelector, useDispatch } from 'react-redux';
import { likevideo } from '../../action/video';
import {
  addtolikedvideo, deletelikedvideo
} from "../../action/likedvideo";
import {
  addtowatchlater, deletewatchlater
} from '../../action/watchlater';

const Likewatchlatersavebtns = ({ vv, vid }) => {
  const dispatch = useDispatch();
  const [saveVideo, setSaveVideo] = useState(false);
  const [dislikeBtn, setDislikeBtn] = useState(false);
  const [likeBtn, setLikeBtn] = useState(false);

  const currentUser = useSelector(state => state.currentuserreducer);
  const likedVideoList = useSelector((state) => state.likedvideoreducer?.data || []);
  const watchLaterList = useSelector((state) => state.watchlaterreducer?.data || []);

  useEffect(() => {
    if (!currentUser?.result?._id) return;

    const userId = currentUser.result._id;

    const liked = likedVideoList.some(video =>
      video.videoid === vid && video.viewer === userId
    );
    setLikeBtn(liked);

    const saved = watchLaterList.some(video =>
      video.videoid === vid && video.viewer === userId
    );
    setSaveVideo(saved);
  }, [likedVideoList, watchLaterList, vid, currentUser]);

  const toggleSaveVideo = () => {
    if (!currentUser) return alert("Please login to save video");

    const userId = currentUser.result._id;
    if (saveVideo) {
      setSaveVideo(false);
      dispatch(deletewatchlater({ videoid: vid, viewer: userId }));
    } else {
      setSaveVideo(true);
      dispatch(addtowatchlater({ videoid: vid, viewer: userId }));
    }
  };

  const toggleLikeVideo = (e, likes) => {
    if (!currentUser) return alert("Please login to like video");

    const userId = currentUser.result._id;
    if (likeBtn) {
      setLikeBtn(false);
      dispatch(likevideo({ id: vid, Like: likes - 1 }));
      dispatch(deletelikedvideo({ videoid: vid, viewer: userId }));
    } else {
      setLikeBtn(true);
      setDislikeBtn(false); // un-dislike if liked
      dispatch(likevideo({ id: vid, Like: likes + 1 }));
      dispatch(addtolikedvideo({ videoid: vid, viewer: userId }));
    }
  };

  const toggleDislikeVideo = (e, likes) => {
    if (!currentUser) return alert("Please login to dislike video");

    if (!dislikeBtn) {
      setDislikeBtn(true);
      if (likeBtn) {
        dispatch(likevideo({ id: vid, Like: likes - 1 }));
        dispatch(deletelikedvideo({ videoid: vid, viewer: currentUser.result._id }));
      }
      setLikeBtn(false);
    } else {
      setDislikeBtn(false);
    }
  };

  return (
    <div className="btns_cont_videoPage">
      <div className="btn_VideoPage">
        <BsThreeDots />
      </div>
      <div className="btn_VideoPage">
        <div className="like_videoPage" onClick={(e) => toggleLikeVideo(e, vv.Like)}>
          {likeBtn
            ? <AiFillLike size={22} className='btns_videoPage' />
            : <AiOutlineLike size={22} className='btns_videoPage' />}
          <b>{vv.Like}</b>
        </div>

        <div className="like_videoPage" onClick={(e) => toggleDislikeVideo(e, vv.Like)}>
          {dislikeBtn
            ? <AiFillDislike size={22} className='btns_videoPage' />
            : <AiOutlineDislike size={22} className='btns_videoPage' />}
          <b>Dislike</b>
        </div>

        <div className="like_videoPage" onClick={toggleSaveVideo}>
          {saveVideo
            ? <>
                <MdPlaylistAddCheck size={22} className='btns_videoPage' />
                <b>Saved</b>
              </>
            : <>
                <RiPlayListAddFill size={22} className='btns_videoPage' />
                <b>Save</b>
              </>}
        </div>

        <div className="like_videoPage">
          <RiHeartAddFill size={22} className="btns_videoPage" />
          <b>Thanks</b>
        </div>

        <div className="like_videoPage">
          <RiShareForwardLine size={22} className='btns_videoPage' />
          <b>Share</b>
        </div>
      </div>
    </div>
  );
};

export default Likewatchlatersavebtns;
