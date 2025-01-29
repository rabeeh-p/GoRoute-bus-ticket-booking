import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatConductor = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatPeople, setChatPeople] = useState([]);
  const [error, setError] = useState('');

  console.log(selectedPerson, 'person');

  // Fetch normal users when component mounts
  useEffect(() => {
    const fetchChatPeople = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/chat/people/');
        console.log(response.data);   

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
          console.log(response.data,'data');
          
          setMessages(response.data);   
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [selectedPerson]);   

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedPerson) {
      const message = {
        sender: 'conductor',
        receiver: selectedPerson.id,
        text: newMessage,
        time: new Date().toLocaleTimeString(),
      };

      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const response = await axios.post(
          `http://localhost:8000/api/chatroom/${selectedPerson.id}/messages/`,
          { message: newMessage },  
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setMessages((prevMessages) => [...prevMessages, response.data]);
        setNewMessage('');  
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleUserSelection = (person) => {
    setSelectedPerson(person);
    setMessages([]);  
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4 bg-red-500 text-white">
          <h2 className="text-lg font-semibold">Chats</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-56px)]">
          {chatPeople.length > 0 ? (
            chatPeople.map((person) => (
              <div
                key={person.id}
                className={`p-4 border-b hover:bg-gray-100 cursor-pointer ${
                  person.unreadCount > 0 ? 'bg-red-50' : 'bg-white'
                }`}
                onClick={() => handleUserSelection(person)}
              >
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

      <div className="flex-1 flex flex-col">
        <div className="bg-red-500 text-white p-4 flex justify-between items-center shadow-md h-[56px]">
          <h2 className="text-lg font-semibold">
            {selectedPerson ? `${selectedPerson.name} Chat` : 'RedBus Chat Support'}
          </h2>
          <button
            className="lg:hidden text-white text-2xl"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {Array.isArray(messages) && messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}   
                className={`flex ${message.user === 'conductor' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div
                  className={`max-w-[60%] p-3 rounded-lg ${
                    message.user === 'conductor' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p>{message.message}</p>
                  <span className="text-xs text-gray-500 mt-2 block text-right">{message.timestamp}</span>
                </div>
              </div>
            ))
          ) : (
            <div>No messages yet.</div>  
          )}
        </div>

        <div className="p-4 bg-white border-t flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring focus:ring-red-200"
          />
          <button
            onClick={handleSendMessage}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatConductor;
