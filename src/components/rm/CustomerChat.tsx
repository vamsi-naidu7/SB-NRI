"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function CustomerChat() {
  const { 
    verificationRequests, 
    maintenanceRequests, 
    leaseRequests, 
    chatMessages, 
    addChatMessage 
  } = useApp();
  
  const [selectedNriId, setSelectedNriId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract unique NRIs from all requests
  const clients = useMemo(() => {
    const clientMap = new Map();
    const addClient = (req: any) => {
      if (!clientMap.has(req.nriId)) {
        clientMap.set(req.nriId, { id: req.nriId, name: req.nriName });
      }
    };
    
    verificationRequests.forEach(addClient);
    maintenanceRequests.forEach(addClient);
    leaseRequests.forEach(addClient);
    
    return Array.from(clientMap.values());
  }, [verificationRequests, maintenanceRequests, leaseRequests]);

  const activeMessages = useMemo(() => {
    if (!selectedNriId) return [];
    return chatMessages.filter(msg => msg.senderId === selectedNriId || msg.receiverId === selectedNriId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [chatMessages, selectedNriId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedNriId) return;

    addChatMessage({
      id: `msg-${Date.now()}`,
      senderId: 'RM-ID',
      senderName: 'RM Name',
      senderRole: 'rm' as any,
      receiverId: selectedNriId,
      receiverName: clients.find(c => c.id === selectedNriId)?.name || 'Unknown',
      message: newMessage,
      timestamp: new Date().toISOString()
    });
    setNewMessage('');
  };

  const selectedClient = clients.find(c => c.id === selectedNriId);

  return (
    <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-[#E8DFD6]/50 rounded-2xl overflow-hidden flex flex-col md:flex-row h-[600px] sm:h-[650px]">
      {/* Sidebar List */}
      <div className={`w-full md:w-1/3 border-r border-[#E8DFD6] bg-white flex flex-col ${selectedNriId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-[#E8DFD6] bg-[#FAF6EF]/50">
          <h2 className="text-lg font-bold text-[#2C3E38]">Assigned NRIs</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {clients.map(client => (
            <button
              key={client.id}
              onClick={() => setSelectedNriId(client.id)}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${
                selectedNriId === client.id 
                  ? 'bg-[#C7A36A]/10 border-[#C7A36A]/30 border' 
                  : 'hover:bg-[#FAF6EF] border border-transparent'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selectedNriId === client.id ? 'bg-[#C7A36A]' : 'bg-[#E8DFD6]'}`}>
                <User className={`w-5 h-5 ${selectedNriId === client.id ? 'text-white' : 'text-[#4A5568]'}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[#2C3E38] font-semibold text-sm truncate">{client.name}</p>
                <p className="text-xs text-[#4A5568] truncate">ID: {client.id.substring(0,8)}...</p>
              </div>
            </button>
          ))}
          {clients.length === 0 && (
            <p className="text-[#4A5568] text-center p-6 text-sm">No clients assigned yet.</p>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`w-full md:w-2/3 flex flex-col bg-[#FAF6EF]/30 ${!selectedNriId ? 'hidden md:flex' : 'flex'}`}>
        {selectedNriId ? (
          <>
            <div className="p-3.5 sm:p-4 border-b border-[#E8DFD6] bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedNriId(null)}
                  className="md:hidden p-2 rounded-xl text-[#2C3E38] hover:bg-[#FAF6EF]"
                  aria-label="Back to clients list"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-[#FAF6EF] border border-[#E8DFD6] flex items-center justify-center shrink-0 text-[#C7A36A]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[#2C3E38] font-bold text-sm sm:text-base">{selectedClient?.name}</h3>
                  <p className="text-xs text-[#C7A36A] flex items-center gap-1 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#C7A36A] inline-block animate-pulse"></span>
                    Active Thread
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[#4A5568] text-sm bg-white px-4 py-2 rounded-full border border-[#E8DFD6]">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                activeMessages.map((msg, i) => {
                  const isRM = msg.senderRole === 'rm';
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i}
                      className={`flex flex-col ${isRM ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[11px] text-[#4A5568] mb-1 px-1">
                        {isRM ? 'You' : selectedClient?.name} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      <div className={`max-w-[85%] sm:max-w-[80%] p-3.5 rounded-2xl shadow-xs text-sm ${
                        isRM 
                          ? 'bg-[#2C3E38] text-white rounded-tr-xs' 
                          : 'bg-white text-[#2C3E38] rounded-tl-xs border border-[#E8DFD6]'
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 sm:p-4 border-t border-[#E8DFD6] bg-white">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-[#FAF6EF]/60 border border-[#E8DFD6] rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-[#2C3E38] text-sm focus:outline-none focus:border-[#C7A36A] focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#C7A36A] hover:bg-[#C7A36A]/90 disabled:opacity-50 text-white rounded-full transition-colors shrink-0 shadow-xs"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#4A5568] p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#E8DFD6]/40 flex items-center justify-center mb-4">
              <Send className="w-7 h-7 text-[#C7A36A]" />
            </div>
            <h3 className="text-xl text-[#2C3E38] font-bold mb-2">Select a Client</h3>
            <p className="text-sm max-w-md text-[#4A5568]">Choose a client from the list to view their messages or start a new conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
