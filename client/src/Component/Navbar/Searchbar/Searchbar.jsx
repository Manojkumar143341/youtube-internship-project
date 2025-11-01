import React, { useState } from 'react';
import "./Searchbar.css";
import { BsMicFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import Searchlist from './Searchlist';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchList, setShowSearchList] = useState(false);

  // Get video titles matching the search query (case-insensitive)
  const videoData = useSelector(state => state.videoreducer?.data) || [];
  const filteredTitles = videoData
    .filter(video => video.videotitle.toLowerCase().includes(searchQuery.toLowerCase()))
    .map(video => video.videotitle);

  // Handle click outside to close search list (optional enhancement)
  const handleInputFocus = () => setShowSearchList(true);

  return (
    <div className="SearchBar_Container">
      <div className="SearchBar_Container2">
        <div className="search_div">
          <input
            type="text"
            className='iBox_SearchBar'
            placeholder='Search'
            onChange={e => setSearchQuery(e.target.value)}
            value={searchQuery}
            onFocus={handleInputFocus}
          />
          <Link to={`/search/${encodeURIComponent(searchQuery)}`}>
            <FaSearch className="searchIcon_SearchBar" />
          </Link>
          <BsMicFill className='Mic_SearchBar' />
          {searchQuery && showSearchList && (
            <Searchlist
              Titlearray={filteredTitles}
              setsearchquery={setSearchQuery}
              setShowSearchList={setShowSearchList}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
