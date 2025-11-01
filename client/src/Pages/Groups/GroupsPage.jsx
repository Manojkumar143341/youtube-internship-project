import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllGroups, createGroup } from '../../action/groups';
import io from 'socket.io-client';
import './GroupsPage.css';

const socket = io('http://localhost:5000'); // change as needed

const GroupsPage = () => {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.groups || []);

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');

  useEffect(() => {
    dispatch(getAllGroups());
  }, [dispatch]);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      if (message.groupId === activeGroup) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [activeGroup]);

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert('Group name is required!');
      return;
    }
    dispatch(createGroup({ name: groupName, description: groupDescription }));
    setGroupName('');
    setGroupDescription('');
  };

  const joinGroup = (groupId) => {
    setActiveGroup(groupId);
    setMessages([]);
    socket.emit('joinGroup', groupId);
  };

  const sendMessage = () => {
    if (!msgInput.trim()) return;
    const message = { text: msgInput, groupId: activeGroup };
    socket.emit('sendMessage', message);
    setMessages((prev) => [...prev, message]);
    setMsgInput('');
  };

  const startVideoCall = (groupId) => {
    alert(`Starting video call for group: ${groupId} (WebRTC logic goes here)`);
  };

  return (
    <div className="groups-container">
      <div className="create-group">
        <h2>Create a Group</h2>
        <input
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter group description"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
        />
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>

      <div className="group-list">
        <h3>All Groups</h3>
        <ul>
          {groups.length === 0 && <li>No groups found.</li>}
          {groups.map((group) => (
            <li key={group._id}>
              <strong>{group.name}</strong>: {group.description}
              <button onClick={() => joinGroup(group._id)}>Join Chat</button>
              <button onClick={() => startVideoCall(group._id)}>Video Call</button>
            </li>
          ))}
        </ul>
      </div>

      {activeGroup && (
        <div className="chat-box">
          <h3>Group Chat</h3>
          <div className="chat-messages">
            {messages.length === 0 && <p>No messages yet. Say hi!</p>}
            {messages.map((m, i) => (
              <p key={i}>{m.text}</p>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type message..."
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
