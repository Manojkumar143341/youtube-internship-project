import React, { useState } from 'react';
import Leftsidebar from '../../Component/Leftsidebar/Leftsidebar';
import { FaHistory } from 'react-icons/fa';
import { MdOutlineWatchLater } from 'react-icons/md';
import { AiOutlineLike } from 'react-icons/ai';
import WHLvideolist from '../../Component/WHL/WHLvideolist';
import { useSelector } from 'react-redux';
import './Library.css';

// Dummy update points logic (replace with backend API call)
const updateUserPoints = (userId, points) => {
  if (!userId) return;
  console.log(`Add ${points} points to user ${userId}`);
  // TODO: Implement backend API or Redux action here
};

const Library = () => {
  const currentuser = useSelector((state) => state.currentuserreducer?.result);
  const likedvideolist = useSelector((state) => state.likedvideoreducer || []);
  const watchlatervideolist = useSelector((state) => state.watchlaterreducer || []);
  const watchhistoryvideolist = useSelector((state) => state.historyreducer || []);

  const DOWNLOADS_KEY = `downloads_${currentuser?._id}`;
  const [downloadsToday, setDownloadsToday] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem(DOWNLOADS_KEY));
      if (!data) return 0;
      const today = new Date().toDateString();
      if (data.date === today) {
        return data.count;
      }
      return 0;
    } catch {
      return 0;
    }
  });

  const incrementDownloads = () => {
    setDownloadsToday((prev) => {
      const newCount = prev + 1;
      localStorage.setItem(
        DOWNLOADS_KEY,
        JSON.stringify({ date: new Date().toDateString(), count: newCount })
      );
      return newCount;
    });
  };

  const onWatchVideo = (videoId) => {
    if (!currentuser?._id) {
      console.warn("User not logged in");
      return;
    }
    updateUserPoints(currentuser._id, 5);
  };

  const onDownloadVideo = () => {
    if (currentuser?.plan.toLowerCase() === "free" && downloadsToday >= 1) {
      alert("Upgrade to premium to download more videos!");
    } else {
      alert("Downloading video...");
      // TODO: Add actual download logic here
      incrementDownloads();
    }
  };

  if (!currentuser) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="container_Pages_App">
      <Leftsidebar />
      <div className="container2_Pages_App">
        {/* History Section */}
        <Section
          icon={<FaHistory />}
          title="History"
          videos={watchhistoryvideolist}
          page="History"
          currentuser={currentuser}
          onWatchVideo={onWatchVideo}
          onDownloadVideo={onDownloadVideo}
          userPlan={currentuser.plan}
          downloadsToday={downloadsToday}
        />

        {/* Watch Later Section */}
        <Section
          icon={<MdOutlineWatchLater />}
          title="Watch later"
          videos={watchlatervideolist}
          page="Watch Later"
          currentuser={currentuser}
          onWatchVideo={onWatchVideo}
          onDownloadVideo={onDownloadVideo}
          userPlan={currentuser.plan}
          downloadsToday={downloadsToday}
        />

        {/* Liked Videos Section */}
        <Section
          icon={<AiOutlineLike />}
          title="Liked Videos"
          videos={likedvideolist}
          page="Liked Videos"
          currentuser={currentuser}
          onWatchVideo={onWatchVideo}
          onDownloadVideo={onDownloadVideo}
          userPlan={currentuser.plan}
          downloadsToday={downloadsToday}
        />
      </div>
    </div>
  );
};

const Section = ({
  icon,
  title,
  videos,
  page,
  currentuser,
  onWatchVideo,
  onDownloadVideo,
  userPlan,
  downloadsToday,
}) => (
  <div className="container_libraryPage">
    <h1 className="title_container_LibraryPage">
      <b>{icon}</b> <b>{title}</b>
    </h1>
    <div className="container_videoList_LibraryPage">
      <WHLvideolist
        page={page}
        currentuser={currentuser?._id}
        videolist={videos || []}
        onWatchVideo={onWatchVideo}
        onDownloadVideo={onDownloadVideo}
        userPlan={userPlan}
        downloadsToday={downloadsToday}
      />
    </div>
  </div>
);

export default Library;
