import React from 'react';
import './Yourvideo.css';
import Leftsidebar from '../../Component/Leftsidebar/Leftsidebar';
import Showvideogrid from '../../Component/Showvideogrid/Showvideogrid';
import { useSelector } from 'react-redux';

const Yourvideo = () => {
  const currentuser = useSelector((state) => state.currentuserreducer);
  const yourvideolist = useSelector((state) =>
    state.videoreducer?.data
      ?.filter((q) => q.videochanel === currentuser?.result?._id)
      .reverse()
  );

  return (
    <div className="container_Pages_App">
      <Leftsidebar />
      <div className="container2_Pages_App">
        <div className="container_yourvideo">
          <h1>Your Videos</h1>
          {currentuser ? (
            yourvideolist?.length > 0 ? (
              <Showvideogrid vid={yourvideolist} />
            ) : (
              <h3>You have not uploaded any videos yet.</h3>
            )
          ) : (
            <h3>Please log in to see your uploaded videos.</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default Yourvideo;
