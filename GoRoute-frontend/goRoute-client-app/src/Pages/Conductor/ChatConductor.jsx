import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatConductor = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatPeople, setChatPeople] = useState([]);
  const [error, setError] = useState('');
  const [firstUser, setFirstUser] = useState('');
  const [secondUser, setSecondUser] = useState('');
  const [roomId, setRoomId] = useState('');
  const [socket, setSocket] = useState(null); // State for WebSocket
  const [isSocketOpen, setIsSocketOpen] = useState(false); // Track WebSocket state
  const [currentUserId, setCurrentUserId] = useState(''); // Track WebSocket state

console.log(messages,'mesgggg');

 
  useEffect(() => {
    const fetchChatPeople = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found');
        return;
      }
  
      try {
        const response = await axios.get('http://localhost:8000/api/chat/people/', { 
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data' 
          }
        });
        console.log(response.data.currentUser.id,'dataaaa');
        setCurrentUserId(response.data.currentUser.id)
        
        if (response.data && Array.isArray(response.data.chatPeople)) {
          setChatPeople(response.data.chatPeople);
        } else {
          console.error('Chat people data is missing or malformed');
          setChatPeople([]);
        }
      } catch (error) {
        console.error('Error fetching chat people:', error);
        setChatPeople([]);
      }
    };
  
    fetchChatPeople();
  
    if (selectedPerson && selectedPerson.id) {
      const fetchMessages = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken) {
            console.error('No access token found');
            return;
          }
  
          const response = await axios.get(
            `http://localhost:8000/api/chatroom/${selectedPerson.id}/messages/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          console.log(response.data, 'data new');
          setRoomId(response.data.chat_room.room_id);
          setMessages(response.data.messages);
          setFirstUser(response.data[0]?.user);  
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
  
      fetchMessages();
    }
  
    if (roomId) {
      console.log(`Attempting to connect to WebSocket for room: ${roomId}`);
      
      // const roomId2 = "4b5ae692-7d76-4765-b4db-5c43cdb6d821"; 
      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${roomId}/`);
      
      // On opening the WebSocket connection
      ws.onopen = () => {
        console.log('WebSocket connection established.');
        setIsSocketOpen(true);
      };
  
      // On receiving a message through the WebSocket
      ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        console.log('Received new message:', data); // Debugging message received
  
        // Update the state with the new message
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            user: data.username,
            message: data.message,
            timestamp: data.timestamp
          }
        ]);
      };
  
      // On WebSocket error
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      // On WebSocket closure (connection closed)
      ws.onclose = (event) => {
        console.log('WebSocket connection closed.', event);
        if (event.code !== 1000) {
          console.log('Unexpected WebSocket closure, attempting to reconnect...');
        }
      };
  
      setSocket(ws); // Save the WebSocket instance for later use
    }
  
    // Cleanup WebSocket connection on component unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [selectedPerson, roomId]);
  

 

  
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return; // Don't send empty messages
    if (socket && socket.readyState === WebSocket.OPEN) {
      // Prevent multiple messages being sent if the WebSocket is open
      socket.send(JSON.stringify({ 
        message: newMessage, 
        user_id: currentUserId // Ensure user_id is sent
      }));
      console.log('Message sent:', newMessage);
      setNewMessage(''); // Clear the input field after sending
    } else {
      console.log('WebSocket not open, retrying...');
      // Retry sending after a short delay if WebSocket is not open
      setTimeout(() => handleSendMessage(), 1000); // Retry in 1 second
    }
  };
  

  const handleMessageInputChange = (e) => {
    setNewMessage(e.target.value);
  };
  



  const handleUserSelection = (person) => {
    setSelectedPerson(person);
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed lg:static top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 bg-red-500 text-white">
          <h2 className="text-lg font-semibold">Chats</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-56px)]">
          {chatPeople.length > 0 ? (
            chatPeople.map((person) => (
              <div key={person.id} className={`p-4 border-b hover:bg-gray-100 cursor-pointer ${person.unreadCount > 0 ? 'bg-red-50' : 'bg-white'}`} onClick={() => handleUserSelection(person)}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{person.name}</span>
                  <span className="text-sm text-gray-500">{person.time}</span>
                </div>
                <p className="text-sm text-gray-600">{person.lastMessage}</p>
                {person.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 mt-2 inline-block">
                    {person.unreadCount}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div>No users available to chat.</div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-red-500 text-white p-4 flex justify-between items-center shadow-md h-[56px]">
          <h2 className="text-lg font-semibold">
            {selectedPerson ? `${selectedPerson.name} Chat` : 'RedBus Chat Support'}
          </h2>
          <button className="lg:hidden text-white text-2xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            ☰
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div key={index} className={`flex ${message.user === firstUser ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-[60%] p-3 rounded-lg ${message.user === firstUser ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
                  <p>{message.message}</p>
                  <span className="text-xs text-gray-500 mt-2 block text-right">{message.timestamp}</span>
                </div>
              </div>
            ))
          ) : (
            <div>No messages yet.</div>
          )}
        </div>

        <div className="p-4 bg-gray-100 flex items-center">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-l-lg"
            value={newMessage}
            onChange={handleMessageInputChange}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage} className="bg-red-500 text-white p-2 rounded-r-lg ml-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatConductor;
