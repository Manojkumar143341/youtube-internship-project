import React, { useState } from 'react';
import './Videoupload.css';
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useSelector, useDispatch } from 'react-redux';
import { uploadvideo } from '../../action/video';

const Videoupload = ({ setvideouploadpage }) => {
  const [title, settitle] = useState("");
  const [videofile, setvideofile] = useState(null);
  const [progress, setprogress] = useState(0);
  const dispatch = useDispatch();

  const currentuser = useSelector(state => state.currentuserreducer);

  const handlesetvideofile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setvideofile(e.target.files[0]);
    }
  };

  const fileoption = {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const percentage = Math.floor((loaded / total) * 100);
      setprogress(percentage);

      if (percentage === 100) {
        // Delay closing upload page a bit after complete
        setTimeout(() => {
          setvideouploadpage(false);
        }, 1500);
      }
    },
  };

  const uploadvideofile = () => {
    if (!title.trim()) {
      alert("Please enter a title for the video");
      return;
    }
    if (!videofile) {
      alert("Please attach a video file");
      return;
    }
    if (videofile.size > 1000000) { // 1 MB size limit
      alert("Please attach a video file less than 1 MB");
      return;
    }

    const filedata = new FormData();
    filedata.append("file", videofile);
    filedata.append("title", title.trim());
    filedata.append("chanel", currentuser?.result?._id);
    filedata.append("uploader", currentuser?.result?.name);

    dispatch(uploadvideo({ filedata, fileoption }));
  };

  return (
    <div className="container_VidUpload">
      <input
        type="button"
        value="X"
        onClick={() => setvideouploadpage(false)}
        className="ibtn_x"
        aria-label="Close video upload"
      />

      <div className="container2_VidUpload">
        <div className="ibox_div_vidupload">
          <input
            type="text"
            maxLength={30}
            placeholder="Enter title of your video"
            className="ibox_vidupload"
            onChange={(e) => settitle(e.target.value)}
            value={title}
          />
          <label htmlFor="file" className="ibox_cidupload btn_vidUpload">
            Choose Video
            <input
              type="file"
              id="file"
              accept="video/*"
              onChange={handlesetvideofile}
              className="ibox_vidupload"
              style={{ display: "none" }}
            />
          </label>
        </div>

        <div className="ibox_div_vidupload">
          <input
            type="button"
            onClick={uploadvideofile}
            value="Upload"
            className="ibox_vidupload btn_vidUpload"
          />

          <div className="loader ibox_div_vidupload">
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={buildStyles({
                rotation: 0.25,
                strokeLinecap: "butt",
                textSize: "20px",
                pathTransitionDuration: 0.5,
                pathColor: `rgba(255, 255, 255, ${progress / 100})`,
                textColor: "#f88",
                trailColor: "#adff2f",
                backgroundColor: "#3e98c7",
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videoupload;
