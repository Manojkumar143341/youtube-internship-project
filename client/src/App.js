import './App.css';
import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from './Component/Navbar/Navbar';
import Drawersliderbar from './Component/Leftsidebar/Drawersliderbar';
import Createeditchannel from './Pages/Channel/Createeditchannel';
import Videoupload from './Pages/Videoupload/Videoupload';
import Allroutes from './Allroutes';

// ✅ Correctly named imports
import { fetchallchannel } from './action/channeluser';
import { getAllVideos } from './action/video';
import { getallcomment } from './action/comment';
import { getallhistory } from './action/history';
import { getalllikedvideo } from './action/likedvideo';
import { getallwatchlater } from './action/watchlater';
// in App.js
import './responsive.css';

function App() {
  const [toggledrawersidebar, settogledrawersidebar] = useState({ display: "none" });
  const [editcreatechanelbtn, seteditcreatechanelbtn] = useState(false);
  const [videouploadpage, setvideouploadpage] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchallchannel());
    dispatch(getAllVideos()); // ✅ Fixed here
    dispatch(getallcomment());
    dispatch(getallhistory());
    dispatch(getalllikedvideo());
    dispatch(getallwatchlater());
  }, [dispatch]);

  const toggledrawer = () => {
    settogledrawersidebar(prev => ({
      display: prev.display === "none" ? "flex" : "none"
    }));
  };

  return (
    <Router>
      {videouploadpage && (
        <Videoupload setvideouploadpage={setvideouploadpage} />
      )}

      {editcreatechanelbtn && (
        <Createeditchannel seteditcreatechanelbtn={seteditcreatechanelbtn} />
      )}

      <Navbar 
        seteditcreatechanelbtn={seteditcreatechanelbtn} 
        toggledrawer={toggledrawer} 
      />

      <Drawersliderbar 
        toggledraw={toggledrawer} 
        toggledrawersidebar={toggledrawersidebar} 
      />

      <Allroutes 
        seteditcreatechanelbtn={seteditcreatechanelbtn}
        setvideouploadpage={setvideouploadpage}
      />
    </Router>
  );
}

export default App;
