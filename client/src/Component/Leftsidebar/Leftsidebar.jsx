import React from 'react';
import './Leftsidebar.css';
import shorts from './shorts.png';
import { AiOutlineHome } from 'react-icons/ai';
import { MdOutlineExplore, MdOutlineSubscriptions, MdOutlineVideoLibrary, MdOutlineVideocam } from 'react-icons/md';
import { FaUsers, FaUserShield, FaDownload, FaCoins } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Leftsidebar = () => {
  const activeClass = ({ isActive }) => (isActive ? 'active_sidebar_link icon_sidebar_div' : 'icon_sidebar_div');

  return (
    <div className="container_leftSidebar">
      <NavLink to="/" className={activeClass}>
        <AiOutlineHome size={22} className="icon_sidebar" />
        <div className="text_sidebar_icon">Home</div>
      </NavLink>

      <NavLink to="/explore" className={activeClass}>
        <MdOutlineExplore size={22} className="icon_sidebar" />
        <div className="text_sidebar_icon">Explore</div>
      </NavLink>

      <NavLink to="/shorts" className={activeClass}>
        <img src={shorts} width={22} alt="Shorts" className="icon_sidebar" />
        <div className="text_sidebar_icon">Shorts</div>
      </NavLink>

      <NavLink to="/subscriptionplans" className={activeClass}>
        <MdOutlineSubscriptions size={22} className="icon_sidebar" />
        <div className="text_sidebar_icon" style={{ fontSize: '12px' }}>Subscription</div>
      </NavLink>

      <NavLink to="/library" className={activeClass}>
        <MdOutlineVideoLibrary size={22} className="icon_sidebar" />
        <div className="text_sidebar_icon">Library</div>
      </NavLink>

      <NavLink to="/groups" className={activeClass}>
        <FaUsers size={22} className="icon_sidebar" />
        <div className="text_sidebar_icon">Groups</div>
      </NavLink>

      <NavLink to="/private-chat" className={activeClass}>
        <FaUserShield size={22} className="icon_sidebar" />
        <div className="text_sidebar_icon">Private Chat</div>
      </NavLink>

      <NavLink to="/download" className={activeClass}>
        <FaDownload size={22} className="icon_sidebar" />
        <div className="text_sidebar_icon">Downloads</div>
      </NavLink>

      <NavLink to="/profile" className={activeClass}>
        <FaCoins size={22} className="icon_sidebar" />
        <div className="text_sidebar_icon">Points & Plans</div>
      </NavLink>

      {/* New Video Call link */}
      <NavLink to="/voipcall" className={activeClass}>
        <MdOutlineVideocam size={22} className="icon_sidebar" />
        <div className="text_sidebar_icon">Video Call</div>
      </NavLink>
    </div>
  );
};

export default Leftsidebar;
