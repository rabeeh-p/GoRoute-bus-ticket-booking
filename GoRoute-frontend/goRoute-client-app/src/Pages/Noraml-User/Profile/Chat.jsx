import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../../axios/axios';

function ChatApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [chatPeople, setChatPeople] = useState([]);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [firstUser, setFirstUser] = useState(null);
  const [secondUser, setSecondUser] = useState(null);

  console.log(messages,'message');
  console.log(firstUser,'first');
  console.log(secondUser,'second');
  

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('No access token found');
      return;
    }
    axios.get('http://127.0.0.1:8000/api/conductor-messages/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        setChatPeople(response.data.conductors);  
      })
      .catch(error => {
        console.error('Error fetching conductors:', error);
      });
  }, []);  

 
  useEffect(() => {
    if (selectedPerson) {
      const accessToken = localStorage.getItem('accessToken');
      axiosInstance.get(`/messages/${selectedPerson.id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          console.log('Fetched messages:', response.data.messages);  
          
          setMessages(prevMessages => ({
            ...prevMessages,
            [selectedPerson.id]: response.data.messages,  
          }));
  
          if (response.data.messages.length > 0) {
            const user1 = response.data.messages[0].user;
            
            const uniqueUsers = [...new Set(response.data.messages.map(msg => msg.user))];
  
            console.log('Unique Users:', uniqueUsers);  
  
            const user2 = uniqueUsers.find(user => user !== user1) || null;
  
            console.log(user1, 'first');
            console.log(user2, 'second');
  
            setFirstUser(user2);
            setSecondUser(user1);
          }
        })
        .catch(error => {
          console.error('Error fetching messages:', error);
        });
    }
  }, [selectedPerson]);
  



  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;  
    const accessToken = localStorage.getItem('accessToken');
    const messageData = {
      message: newMessage,  
      room_id: selectedPerson.room_id,  
    };

    axiosInstance.post('/api/send-message/', messageData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setMessages(prevMessages => ({
          ...prevMessages,
          [selectedPerson.id]: [...(prevMessages[selectedPerson.id] || []), response.data.message],
        }));
        setNewMessage('');  
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        <div className="p-4 bg-red-500 text-white">
          <h2 className="text-lg font-semibold">Chats</h2>
        </div>

        <div className="overflow-y-auto h-[calc(100%-56px)]">
          {chatPeople.map((person) => (
            <div
              key={person.id}
              className={`p-4 border-b hover:bg-gray-100 cursor-pointer ${person.unreadCount > 0 ? 'bg-red-50' : 'bg-white'
                }`}
              onClick={() => setSelectedPerson(person)}  
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{person.name}</span>
                <span className="text-sm text-gray-500">{person.time}</span>
              </div>

              {person.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 mt-2 inline-block">
                  {person.unreadCount}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-red-500 text-white p-4 flex justify-between items-center shadow-md h-[56px]">
          <h2 className="text-lg font-semibold">
            {selectedPerson ? `${selectedPerson.name} Chat` : 'Select a Chat'}
          </h2>
          <button
            className="lg:hidden text-white text-2xl"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {selectedPerson && messages[selectedPerson.id] && messages[selectedPerson.id].length > 0 ? (
            messages[selectedPerson.id].map((message) => (
              <div key={message.timestamp} className="mb-4">
                <div
                  className={`flex ${message.user === firstUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-xs break-words ${
                      message.user === firstUser
                        ? 'bg-red-500 text-white'   
                        : 'bg-gray-200 text-gray-800'   
                    }`}
                  >
                    {/* Message content */}
                    <p>{message.message}</p>
                  </div>
                </div>
                {/* Timestamp */}
                <div className={`text-sm text-gray-500 ${message.user === firstUser ? 'text-right' : 'text-left'}`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No messages available</div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t flex items-center space-x-3">
          {/* Input for new message */}
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder="Type your message"
            value={newMessage}  
            onChange={(e) => setNewMessage(e.target.value)}  
          />
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleSendMessage}  
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
