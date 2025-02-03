import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatConductor = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatPeople, setChatPeople] = useState([]);
  const [error, setError] = useState('');
  const [roomId, setRoomId] = useState('');
  const [socket, setSocket] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const messagesEndRef = useRef(null);

  const [firstUser, setFirstUser] = useState('');

  useEffect(() => {
    const fetchChatPeople = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found');
        return;
      }
      try {
        const response = await axios.get('http://localhost:8000/api/chat/people/', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setCurrentUserId(response.data.currentUser.id);
        setChatPeople(response.data.chatPeople || []);
      } catch (error) {
        console.error('Error fetching chat people:', error);
      }
    };
    fetchChatPeople();
  }, []);

  useEffect(() => {
    if (!selectedPerson) return;
    const fetchMessages = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;
        const response = await axios.get(`http://localhost:8000/api/chatroom/${selectedPerson.id}/messages/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setRoomId(response.data.chat_room.room_id);
        if (response.data.messages.length > 0) {
          setFirstUser(response.data.messages[0].user);
        }
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [selectedPerson]);

  useEffect(() => {
    if (!roomId) return;
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${roomId}/`);
    ws.onopen = () => console.log('WebSocket connected');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };
    ws.onerror = (error) => console.error('WebSocket error:', error);
    ws.onclose = () => console.log('WebSocket closed');
    setSocket(ws);
    return () => ws.close();
  }, [roomId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;
    const timestamp = new Date().toISOString();
    socket.send(JSON.stringify({ message: newMessage, user_id: currentUserId, timestamp }));
    setNewMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed lg:static top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 bg-red-500 text-white">Chats</div>
        <div className="overflow-y-auto h-[calc(100%-56px)]">
          {chatPeople.map((person) => (
            <div key={person.id} onClick={() => setSelectedPerson(person)} className="p-4 border-b hover:bg-gray-100 cursor-pointer">
              <span className="font-semibold">{person.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-red-500 text-white p-4 shadow-md flex justify-between items-center">
          {selectedPerson ? selectedPerson.name : "Chat"}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-white">
            {isSidebarOpen ? 'Close' : 'Open'} Sidebar
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.user === firstUser ? "justify-end" : "justify-start"} mb-4`}>
              <div className={`max-w-[60%] p-3 rounded-lg ${message.user === firstUser ? "bg-red-600 text-white" : "bg-gray-800 text-white"}`}>
                <p className="break-words">{message.message}</p>
                <p className="text-xs text-gray-300">
                  {new Date(message.timestamp).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Message Input */}
        <div className="p-4 bg-gray-100 flex items-center">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-l-lg"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-red-500 text-white p-2 rounded-r-lg ml-2"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatConductor;
