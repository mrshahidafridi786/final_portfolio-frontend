import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Mail, Search, Trash2, Circle } from 'lucide-react';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesEditor() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async (search: string = '') => {
    setLoading(true);
    try {
      const response = await api.get(`/messages${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      setMessages(response.data || []);
      if (selectedMessage) {
        const updated = response.data.find((m: any) => m._id === selectedMessage._id);
        setSelectedMessage(updated || null);
      }
    } catch (err) {
      console.error('Error fetching messages', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchMessages(query);
  };

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      try {
        await api.put(`/messages/${msg._id}/read`, { isRead: true });
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
        setSelectedMessage(prev => prev ? { ...prev, isRead: true } : null);
      } catch (err) {
        console.error('Error marking message as read', err);
      }
    }
  };

  const handleToggleRead = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newStatus = !msg.isRead;
      await api.put(`/messages/${msg._id}/read`, { isRead: newStatus });
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: newStatus } : m));
      if (selectedMessage?._id === msg._id) {
        setSelectedMessage(prev => prev ? { ...prev, isRead: newStatus } : null);
      }
    } catch (err) {
      console.error('Error toggling read status', err);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await api.delete(`/messages/${id}`);
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
      fetchMessages(searchQuery);
    } catch (err) {
      console.error('Error deleting message', err);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)] flex flex-col">
      <div>
        <h3 className="text-2xl font-bold">Contact Messages Inbox</h3>
        <p className="text-sm text-white/60 mt-1">Review inquiries, questions, and project proposals submitted through your homepage contact form.</p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 bg-[#050816] rounded-2xl border border-white/5 overflow-hidden">
        {/* Left Column: Messages List */}
        <div className="w-full md:w-2/5 border-r border-white/5 flex flex-col bg-slate-950/20">
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
            <Search size={16} className="text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-transparent focus:outline-none text-xs placeholder-white/30 text-white"
              placeholder="Search by sender, email, content..."
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {loading && messages.length === 0 ? (
              <div className="flex h-32 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-cyan"></div>
              </div>
            ) : messages.length === 0 ? (
              <p className="text-xs text-white/30 italic text-center py-8">Inbox is empty.</p>
            ) : (
              messages.map((msg) => {
                const isSelected = selectedMessage?._id === msg._id;
                const formattedDate = new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                return (
                  <div
                    key={msg._id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 cursor-pointer hover:bg-white/5 transition-colors relative flex flex-col gap-1.5 ${isSelected ? 'bg-white/5 border-l-4 border-accent-blue pl-3' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-xs ${!msg.isRead ? 'font-bold text-white' : 'text-white/60'}`}>{msg.name}</span>
                      <span className="text-[10px] text-white/40">{formattedDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs truncate max-w-[200px] ${!msg.isRead ? 'font-bold text-accent-cyan' : 'text-white/45'}`}>
                        {msg.subject || 'No Subject'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleToggleRead(msg, e)}
                          className={`p-1 rounded hover:bg-white/10 ${!msg.isRead ? 'text-accent-cyan' : 'text-white/20'}`}
                          title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                        >
                          <Circle size={10} fill={!msg.isRead ? 'currentColor' : 'transparent'} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(msg._id, e)}
                          className="p-1 rounded hover:bg-white/10 text-white/20 hover:text-red-400"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed View */}
        <div className="hidden md:flex flex-col flex-1 min-h-0 bg-[#070b1e]">
          {selectedMessage ? (
            <div className="flex-1 flex flex-col min-h-0 p-6 justify-between">
              <div className="space-y-6 overflow-y-auto">
                <div className="flex items-start justify-between border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-white">{selectedMessage.subject || 'No Subject'}</h4>
                    <div className="flex flex-col text-xs text-white/60">
                      <span>Sender: <strong className="text-white">{selectedMessage.name}</strong> ({selectedMessage.email})</span>
                      <span>Date Received: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 font-sans text-xs font-bold text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-white/5 bg-[#050816] text-sm text-white/80 leading-relaxed font-sans whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/20">
              <Mail size={48} className="mb-3" />
              <span className="text-xs uppercase tracking-widest">Select a message to view detail</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
