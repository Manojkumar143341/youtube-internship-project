import React, { useState } from 'react';
import Describechannel from './Describechannel';
import Leftsidebar from '../../Component/Leftsidebar/Leftsidebar';
import Showvideogrid from '../../Component/Showvideogrid/Showvideogrid'; // keep import
import vid from "../../Component/Video/vid.mp4";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Video player with quality selector
const VideoPlayer = ({ video }) => {
  const [quality, setQuality] = useState('720p');

  const videoQualities = {
    '320p': video.video_src.replace('.mp4', '-320p.mp4'),
    '480p': video.video_src.replace('.mp4', '-480p.mp4'),
    '720p': video.video_src.replace('.mp4', '-720p.mp4'),
    '1080p': video.video_src.replace('.mp4', '-1080p.mp4'),
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <video controls width="100%" key={quality}>
        <source src={videoQualities[quality] || video.video_src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={{ marginTop: '5px' }}>
        <label><b>Select Quality: </b></label>
        <select value={quality} onChange={e => setQuality(e.target.value)}>
          {Object.keys(videoQualities).map(q => (
            <option key={q} value={q}>{q}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

// YouTube-style video card with expandable description, likes, uploader info
const VideoCard = ({ video }) => {
  const [descExpanded, setDescExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  // Mock views and upload date (replace with real data if available)
  const views = video.views || Math.floor(Math.random() * 1000000);
  const uploadDate = video.uploadDate || '1 week ago';

  // Toggle like
  const toggleLike = () => setLiked(prev => !prev);

  // Shorten description for collapsed view
  const shortDesc = video.description.length > 150 ? video.description.slice(0, 150) + "..." : video.description;

  return (
    <div style={{
      border: '1px solid #ddd',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
      background: 'white'
    }}>
      <h3 style={{ marginBottom: '10px' }}>{video.title}</h3>

      <VideoPlayer video={video} />

      <div style={{ marginBottom: '10px', color: '#555', fontSize: '0.9rem' }}>
        <span>By <b>{video.uploader || 'Unknown Uploader'}</b></span> | {' '}
        <span>{views.toLocaleString()} views</span> | {' '}
        <span>{uploadDate}</span>
      </div>

      <div style={{ marginBottom: '10px', fontSize: '1rem', lineHeight: 1.4, color: '#333' }}>
        {descExpanded ? video.description : shortDesc}
        {video.description.length > 150 && (
          <button
            onClick={() => setDescExpanded(!descExpanded)}
            style={{
              border: 'none',
              background: 'none',
              color: '#065fd4',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginLeft: '5px',
            }}
          >
            {descExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      <button
        onClick={toggleLike}
        style={{
          backgroundColor: liked ? '#ff0000' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '8px 15px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        {liked ? 'Liked ❤️' : 'Like 👍'}
      </button>
    </div>
  );
};

const CustomShowvideogrid = ({ vids }) => {
  if (!vids || vids.length === 0) return <p>No videos to show</p>;

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit,minmax(350px,1fr))', 
      gap: '30px',
      paddingTop: '20px'
    }}>
      {vids.map(video => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

const Channel = ({ seteditcreatechanelbtn, setvideouploadpage }) => {
  const { cid } = useParams();
  let vids = useSelector(state => state.videoreducer)?.data?.filter(q => q?.videochanel === cid)?.reverse();

  if (!vids || vids.length === 0) {
    vids = [
      {
        _id: 1,
        video_src: vid,
        title: "Fallback Video",
        uploader: "Fallback Uploader",
        description: "This is a fallback video description"
      }
    ];
  }

  return (
    <div className="container_Pages_App" style={{ display: 'flex', minHeight: '100vh', background: '#f9f9f9' }}>
      <Leftsidebar />
      <div className="container2_Pages_App" style={{ flex: 1, padding: '30px 40px' }}>
        <Describechannel 
          cid={cid} 
          setvideouploadpage={setvideouploadpage} 
          seteditcreatechanelbtn={seteditcreatechanelbtn} 
        />
        <CustomShowvideogrid vids={vids} />
      </div>
    </div>
  );
};

export default Channel;
