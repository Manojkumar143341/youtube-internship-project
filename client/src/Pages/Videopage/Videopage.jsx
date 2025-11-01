import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import VideoPlayer from '../../Component/VideoPlayer/VideoPlayer';
import Comment from '../../Component/Comment/Comment'; // Import Comment component
import { getAllVideos } from '../../action/video';

const Videopage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const videos = useSelector((state) => state.videoreducer?.data || []);
  const loading = useSelector((state) => state.videoreducer?.loading);

  const video = videos.find((v) => v._id === id);

  useEffect(() => {
    if (!videos.length) {
      dispatch(getAllVideos());
    }
  }, [dispatch, videos.length]);

  return (
    <div style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto' }}>
      {loading ? (
        <p>Loading video...</p>
      ) : video ? (
        <>
          <VideoPlayer video={video} />
          <Comment videoId={video._id} /> {/* Comments below video */}
        </>
      ) : (
        <p style={{ color: 'red' }}>Video not found.</p>
      )}
    </div>
  );
};

export default Videopage;
