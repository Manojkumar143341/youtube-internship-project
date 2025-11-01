// src/Component/GroupsBar/GroupsBar.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGroups } from "../../action/groups";
import { useNavigate } from "react-router-dom";
import { FaVideo } from "react-icons/fa"; // Video call icon

const GroupsBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const groups = useSelector((state) => state.groups);

  useEffect(() => {
    dispatch(getAllGroups());
  }, [dispatch]);

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`); // Route to specific chat page
  };

  const handleVideoCall = (groupId) => {
    alert(`Start video call for group: ${groupId} (WebRTC logic goes here)`);
  };

  return (
    <div style={{ padding: "10px", background: "#f5f5f5", borderRight: "1px solid #ccc" }}>
      <h3>Groups</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {groups.map((group) => (
          <li
            key={group._id}
            style={{
              padding: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #ddd",
              cursor: "pointer"
            }}
          >
            <span onClick={() => handleGroupClick(group._id)}>{group.name}</span>
            <FaVideo
              style={{ color: "#007bff", cursor: "pointer" }}
              title="Start Video Call"
              onClick={() => handleVideoCall(group._id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupsBar;
