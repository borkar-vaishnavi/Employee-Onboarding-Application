import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CandidateChatStyles.css';
import backendURL from '../../baseURL';

const CandidateChat = () => {
  const { candidateId } = useParams();
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [hr, setHr] = useState(null);

  const fetchChatDetails = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/chat/${candidateId}`);
      const { chat, candidate, hr } = response.data;
      setChats(chat.messages);
      setCandidate(candidate);
      setHr(hr);
    } catch (error) {
      console.error('Error fetching chat details:', error);
    }
  };

  useEffect(() => {
    fetchChatDetails();
  }, [candidateId]);

  const handleSendMessage = async () => {
    try {
      await axios.post(`${backendURL}/api/chat/${candidateId}`, {
        text: message,
        role: 'candidate',
      });
      fetchChatDetails();
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div>
        <h2>Chat Messages:</h2>
        {chats.map((chat, index) => (
          <div className="chat-message" key={index}>
            {chat.role === 'hr' && hr && hr.photo && <img className="user-photo" src={hr.photo} alt="HR" />}
            {chat.role === 'candidate' && candidate && candidate.photo && <img className="user-photo" src={candidate.photo} alt="Candidate" />}
            <div className="message-text">{chat.text}</div>
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="send-button" onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default CandidateChat;
