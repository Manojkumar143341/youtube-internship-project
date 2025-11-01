import React from 'react';
import { FaSearch } from "react-icons/fa";
import './Searchlist.css';

const Searchlist = ({ Titlearray, setsearchquery, setShowSearchList }) => {

  const handleClick = (title) => {
    setsearchquery(title);
    setShowSearchList(false);  // close dropdown after selection
  };

  if (!Titlearray.length) {
    return (
      <div className="Container_SearchList">
        <p className="no-results">No results found</p>
      </div>
    );
  }

  return (
    <div className="Container_SearchList">
      {Titlearray.map(title => (
        <p
          key={title}
          onClick={() => handleClick(title)}
          className='titleItem'
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') handleClick(title); }}
        >
          <FaSearch /> {title}
        </p>
      ))}
    </div>
  );
};

export default Searchlist;
