import React from 'react';
import Describechannel from './Describechannel';
import Leftsidebar from '../../Component/Leftsidebar/Leftsidebar';
import vid from "../../Component/Video/vid.mp4";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// VideoPlayer component with single source for now
const VideoPlayer = ({ video }) => {
  const videoSrc = video.filepath || video.video_src || vid;

  return (
    <video controls width="100%" height="auto" preload="metadata" style={{ borderRadius: '8px' }}>
      <source src={videoSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

// Helper: truncate long text with ellipsis
const truncate = (text, maxLength = 100) =>
  text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

const Showvideogrid = ({ vids }) => {
  if (!vids || vids.length === 0) return <p>No videos to show</p>;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
        gap: '1rem',
        marginTop: '20px',
      }}
    >
      {vids.map((video) => (
        <div
          key={video._id || video.id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px',
            background: '#fff',
            boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#202020' }}>
            {video.videotitle || video.title}
          </h4>

          <VideoPlayer video={video} />

          <p style={{ marginTop: '8px', color: '#606060', fontSize: '0.9rem' }}>
            {truncate(video.description || 'No description available', 140)}
          </p>
        </div>
      ))}
    </div>
  );
};

const Channel = ({ seteditcreatechanelbtn, setvideouploadpage }) => {
  const { cid } = useParams();

  const reduxVideos = useSelector(state => state.videoreducer?.data);
  const vidsFromRedux = reduxVideos?.filter(video => video.videochanel === cid)?.reverse();

  const fallbackVids = [
    {
      _id: 'fallback1',
      video_src: vid,
      videochanel: cid,
      videotitle: "Fallback Video 1",
      description: "This is a fallback video example.",
      filepath: vid,
    },
    {
      _id: 'fallback2',
      video_src: vid,
      videochanel: cid,
      videotitle: "Fallback Video 2",
      description: "Another fallback video example.",
      filepath: vid,
    },
  ];

  const vids = vidsFromRedux && vidsFromRedux.length > 0 ? vidsFromRedux : fallbackVids;

  return (
    <div
      className="container_Pages_App"
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        overflowX: 'hidden',
      }}
    >
      <div style={{ flexShrink: 0, height: '100vh', overflowY: 'auto' }}>
        <Leftsidebar />
      </div>

      <main
        className="container2_Pages_App"
        style={{
          flex: 1,
          padding: '30px 40px',
          overflowY: 'auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          margin: '20px',
          boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)',
        }}
      >
        <Describechannel
          cid={cid}
          setvideouploadpage={setvideouploadpage}
          seteditcreatechanelbtn={seteditcreatechanelbtn}
        />
        <Showvideogrid vids={vids} />
      </main>
    </div>
  );
};

export default Channel;
