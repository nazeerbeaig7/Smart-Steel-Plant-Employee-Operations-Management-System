import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Bot, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am SteelBot. How can I help you with your operations today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Don't render chatbot if not logged in
  if (!user) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post('/api/chatbot/query', { message: userMsg });
      setMessages(prev => [...prev, { id: Date.now(), text: res.data.reply, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), text: "Sorry, I'm having trouble connecting right now.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95 z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-steel-200 z-50 flex flex-col" style={{ height: '500px' }}>
          <div className="bg-blue-600 p-4 text-white flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg"><Bot className="w-6 h-6" /></div>
            <div>
              <h3 className="font-semibold">SteelBot</h3>
              <p className="text-blue-100 text-xs">AI Assistant</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-steel-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-steel-100 text-steel-800 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-steel-100 rounded-2xl rounded-bl-none p-3 shadow-sm flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-steel-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-steel-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-steel-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-steel-100">
            <form onSubmit={handleSend} className="flex space-x-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask SteelBot..."
                className="flex-1 bg-steel-50 border border-steel-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()} 
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
              >
                <Send className="w-4 h-4 ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
