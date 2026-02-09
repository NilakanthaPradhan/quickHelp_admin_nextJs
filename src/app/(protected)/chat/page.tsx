'use client';

import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { Send, User as UserIcon } from 'lucide-react';

interface ChatUser {
  id: number;
  fullName: string;
  photoData?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const [recentChats, setRecentChats] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const u = JSON.parse(userStr);
      setCurrentUserId(u.id);
      fetchRecentChats(u.id);
    }
  }, []);

  useEffect(() => {
    if (selectedUser && currentUserId) {
      fetchMessages(currentUserId, selectedUser.id);
      // Optional: Set up polling for real-time
      const interval = setInterval(() => fetchMessages(currentUserId, selectedUser.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchRecentChats = async (userId: number) => {
    try {
      const response = await api.get(`/messages/recent/${userId}`);
      if (response.status === 200) {
        setRecentChats(response.data);
      }
    } catch (error) {
      console.error('Error fetching recent chats:', error);
    }
  };

  const fetchMessages = async (userId: number, otherId: number) => {
    try {
      const response = await api.get(`/messages/${userId}/${otherId}`);
      if (response.status === 200) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !currentUserId) return;

    try {
      await api.post('/messages', {
        senderId: currentUserId,
        receiverId: selectedUser.id,
        content: newMessage
      });
      setNewMessage('');
      fetchMessages(currentUserId, selectedUser.id); // Refresh immediately
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex">
      {/* Sidebar List */}
      <div className="w-80 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800 bg-slate-900">
          <h3 className="font-bold text-slate-200">Conversations</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {recentChats.length === 0 ? (
             <p className="p-4 text-slate-500 text-sm">No recent conversations.</p>
          ) : (
            recentChats.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-slate-800 transition-colors text-left ${
                  selectedUser?.id === user.id ? 'bg-slate-800' : ''
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                   {user.photoData ? (
                      <img src={`data:image/jpeg;base64,${user.photoData}`} alt={user.fullName} className="h-full w-full object-cover" />
                   ) : (
                      <UserIcon className="h-5 w-5 text-slate-400" />
                   )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-200 truncate">{user.fullName}</div>
                  <div className="text-xs text-slate-500 truncate">{user.lastMessage}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-950">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900">
              <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                {selectedUser.photoData ? (
                  <img src={`data:image/jpeg;base64,${selectedUser.photoData}`} alt="" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-4 w-4 text-slate-400" />
                )}
              </div>
              <span className="font-bold text-slate-200">{selectedUser.fullName}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-slate-800 text-slate-200 rounded-bl-none'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-[10px] opacity-70 mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900 flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-800 border-none rounded-full px-4 text-slate-200 focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
