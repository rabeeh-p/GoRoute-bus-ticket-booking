import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function ChatApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);


  const [message, setMessage] = useState('');
  const [messages1, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);



//   useEffect(() => {
//     // const socketInstance = io('ws://localhost:8000/ws/chat/');  
//     const socketInstance = new WebSocket('ws://localhost:8000/ws/chat/'); 
//     setSocket(socketInstance);

//     socketInstance.on('message', (data) => {
//         setMessages((prevMessages) => [...prevMessages, data.message]);
//     });

//     return () => {
//         socketInstance.disconnect();
//     };
// }, []);

useEffect(() => {
    const socketInstance = new WebSocket('ws://localhost:8000/ws/chat/'); 
    setSocket(socketInstance);

    // Add event listener for 'message' event
    socketInstance.addEventListener('message', (event) => {
        const data = JSON.parse(event.data); // Assuming data is in JSON format
        setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    // Cleanup on component unmount
    return () => {
        socketInstance.close(); // Proper way to disconnect WebSocket
    };
}, []);







  const chatPeople = [
    { id: 1, name: 'John Doe', unreadCount: 2, time: '10:15 AM', lastMessage: 'Hey, how are you?' },
    { id: 2, name: 'Jane Smith', unreadCount: 1, time: '9:45 AM', lastMessage: 'Can you help me with this?' },
  ];

  const messages = [
    { id: 1, sender: 'user', text: 'Hello!', time: '10:15 AM' },
    { id: 2, sender: 'support', text: 'Hi, how can I assist you?', time: '10:16 AM' },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4 bg-red-500 text-white">
          <h2 className="text-lg font-semibold">Chats</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-56px)]">
          {chatPeople.map((person) => (
            <div
              key={person.id}
              className={`p-4 border-b hover:bg-gray-100 cursor-pointer ${
                person.unreadCount > 0 ? 'bg-red-50' : 'bg-white'
              }`}
              onClick={() => setSelectedPerson(person)}  // onClick handler
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
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              } mb-4`}
            >
              <div
                className={`max-w-[60%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p>{message.text}</p>
                <span className="text-xs text-gray-500 mt-2 block text-right">
                  {message.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
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
}

export default ChatApp;
