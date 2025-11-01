import React from "react";
import { useSelector } from "react-redux";
import "./Profile.css";

const Profile = () => {
  const user = useSelector((state) => state.currentuserreducer);

  if (!user) {
    return <p style={{ color: "white", padding: "20px" }}>Please login to view your profile.</p>;
  }

  const { result } = user;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-photo">
          {result?.imageUrl ? (
            <img src={result.imageUrl} alt="Profile" />
          ) : (
            <div className="initials">
              {result?.name ? result.name.charAt(0).toUpperCase() : result.email.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-details">
          <h2>{result?.name || "Your Channel Name"}</h2>
          <p className="profile-email">{result?.email}</p>
          <p className="profile-points">
            Points: <b>{result?.points || 0}</b>
          </p>
          <p className="profile-plan">
            Current Plan: <b>{result?.plan || "Free"}</b>
          </p>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
