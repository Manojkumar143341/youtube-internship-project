import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Describechannel.css';
import { FaEdit, FaUpload, FaUsers, FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Describechannel = ({ setvideouploadpage, cid, seteditcreatechanelbtn }) => {
  const channel = useSelector(state => state.chanelreducer) || [];
  const currentuser = useSelector(state => state.currentuserreducer?.result);
  const userProfile = useSelector(state => state.userprofilereducer) || {};

  const currentchannel = channel.find(c => c._id === cid);

  const [showInvite, setShowInvite] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [inviteStatus, setInviteStatus] = useState(null);

  // Hook for searching users for invite (debounced)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setLoadingSearch(true);
      axios
        .get(`/user/search?query=${encodeURIComponent(searchTerm)}`)
        .then(res => {
          setSearchResults(res.data);
          setLoadingSearch(false);
        })
        .catch(() => {
          setSearchResults([]);
          setLoadingSearch(false);
        });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  if (!currentchannel) {
    return <p>Channel not found.</p>;
  }

  const { name, desc, _id } = currentchannel;
  const isOwner = currentuser?._id === _id;

  // Example user data for points and plan
  const userPoints = userProfile?.points || 0;
  const userPlan = userProfile?.plan || 'Free'; // Free, Bronze, Silver, Gold

  const handleInvite = (userIdToInvite) => {
    if (!userIdToInvite) return;
    // Example invite API call
    axios
      .post('/group/invite', { channelId: _id, userId: userIdToInvite })
      .then(() => {
        setInviteStatus('Invite sent!');
      })
      .catch(() => {
        setInviteStatus('Failed to send invite.');
      });
  };

  return (
    <div className="container3_chanel">
      <div className="chanel_logo_chanel">
        <b>{name?.charAt(0).toUpperCase()}</b>
      </div>
      <div className="description_chanel">
        <b>{name}</b>
        <p>{desc}</p>

        {/* Show points and plan */}
        {isOwner && (
          <div style={{ marginTop: '10px' }}>
            <p><FaStar /> Points: {userPoints}</p>
            <p>Current Plan: <b>{userPlan}</b></p>
            <button onClick={() => alert('Redirect to Upgrade Plan')}>Upgrade Plan</button>
          </div>
        )}
      </div>

      {isOwner && (
        <>
          <p className="editbtn_chanel" onClick={() => seteditcreatechanelbtn(true)}>
            <FaEdit /> <b>Edit Channel</b>
          </p>
          <p className="uploadbtn_chanel" onClick={() => setvideouploadpage(true)}>
            <FaUpload /> <b>Upload Video</b>
          </p>

          {/* Invite group button */}
          <p
            className="invitebtn_chanel"
            onClick={() => {
              setShowInvite(true);
              setInviteStatus(null);
              setSearchTerm('');
              setSearchResults([]);
            }}
            style={{ cursor: 'pointer' }}
          >
            <FaUsers /> <b>Invite to Group</b>
          </p>
        </>
      )}

      {/* Simple Invite modal/popup */}
      {showInvite && (
        <div
          className="invite-modal"
          style={{
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            zIndex: 1000,
            width: '300px'
          }}
        >
          <h3>Invite Users to Group</h3>
          <input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          {loadingSearch && <p>Searching...</p>}
          <ul style={{ maxHeight: '150px', overflowY: 'auto', paddingLeft: 0 }}>
            {searchResults.length === 0 && !loadingSearch && <li>No users found</li>}
            {searchResults.map(user => (
              <li
                key={user._id}
                style={{
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                  padding: '6px 0'
                }}
                onClick={() => handleInvite(user._id)}
              >
                {user.name} ({user.email})
              </li>
            ))}
          </ul>
          {inviteStatus && <p>{inviteStatus}</p>}
          <button onClick={() => setShowInvite(false)} style={{ marginTop: '10px' }}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Describechannel;
