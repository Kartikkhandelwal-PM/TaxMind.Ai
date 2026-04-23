import React, { useState } from 'react';
import { Plus, Trash2, Hexagon, MoreHorizontal, PanelLeftClose, Search, Sparkles, User, Settings, HelpCircle, LogOut, ChevronRight, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface HistoryItem {
  id: string;
  title: string;
  group: string;
}

interface SidebarProps {
  onNewChat: () => void;
  onOpenProfile?: () => void;
  onOpenUpgrade?: () => void;
  onOpenPersonalization?: () => void;
  onOpenHelp?: () => void;
  onLogout?: () => void;
  onCloseSidebar: () => void;
  history: HistoryItem[];
  onSelectHistory?: (id: string) => void;
  activeHistoryId?: string | null;
  onDeleteHistory: (id: string) => void;
}

export function Sidebar({ onNewChat, onOpenProfile, onOpenUpgrade, onOpenPersonalization, onOpenHelp, onLogout, onCloseSidebar, history, onSelectHistory, activeHistoryId, onDeleteHistory }: SidebarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteHistory(id);
  };

  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedHistory = filteredHistory.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof history>);

  return (
    <div className="w-[280px] bg-white/40 backdrop-blur-3xl text-[#1a273b] flex flex-col h-full shrink-0 z-10 transition-all font-sans relative border-r border-[#f1f5f9]">
      
      {/* Profile Popover Sheet */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="fixed inset-0 z-20"
            />
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="absolute bottom-20 left-3 right-3 bg-white rounded-[24px] shadow-[0_4px_30px_rgba(0,0,0,0.12)] border border-[#e2e8f0] p-2 z-30 flex flex-col"
            >
              {/* User Header */}
              <div onClick={() => { setIsProfileOpen(false); }} className="flex items-center justify-between p-3 hover:bg-[#f8fafc] rounded-xl cursor-pointer transition-colors mb-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#F87C71] flex items-center justify-center text-white text-[14px] font-bold shrink-0">KK</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[#1a273b] truncate text-left">Kartik khandelwal</p>
                    <p className="text-[12px] text-[#8999af] text-left">Starter</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8999af]" />
              </div>
              
              <div className="w-full h-px bg-[#f1f5f9] mb-1" />
              
              <button onClick={() => { onOpenUpgrade?.(); setIsProfileOpen(false); }} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#f8fafc] text-[#1a273b] transition-all">
                <Sparkles className="w-4 h-4 text-[#1a273b]" />
                <span className="text-[13px] font-medium tracking-wide">Upgrade plan</span>
              </button>
              
              <button onClick={() => { onOpenPersonalization?.(); setIsProfileOpen(false); }} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#f8fafc] text-[#1a273b] transition-all">
                 <Sliders className="w-4 h-4 text-[#1a273b]" />
                 <span className="text-[13px] font-medium tracking-wide">Personalization</span>
              </button>

              <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#f8fafc] text-[#1a273b] transition-all">
                 <User className="w-4 h-4 text-[#1a273b]" />
                 <span className="text-[13px] font-medium tracking-wide">Profile</span>
              </button>

              <button onClick={() => { onOpenProfile?.(); setIsProfileOpen(false); }} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#f8fafc] text-[#1a273b] transition-all">
                 <Settings className="w-4 h-4 text-[#1a273b]" />
                 <span className="text-[13px] font-medium tracking-wide">Settings</span>
              </button>

              <div className="w-full h-px bg-[#f1f5f9] my-1" />

               <button onClick={() => { onOpenHelp?.(); setIsProfileOpen(false); }} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#f8fafc] text-[#1a273b] transition-all">
                 <div className="flex items-center space-x-3">
                   <HelpCircle className="w-4 h-4 text-[#1a273b]" />
                   <span className="text-[13px] font-medium tracking-wide">Help</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-[#8999af]" />
              </button>

              <button onClick={() => { onLogout?.(); setIsProfileOpen(false); }} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#f8fafc] text-[#1a273b] transition-all">
                 <LogOut className="w-4 h-4 text-[#1a273b]" />
                 <span className="text-[13px] font-medium tracking-wide">Log out</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Brand Header */}
      <div className="p-4 pt-6 flex items-center justify-between bg-transparent">
        <div className="flex items-center space-x-3">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="bg-[#3A759B] p-1.5 rounded-[12px] shadow-[0_4px_12px_rgba(58,117,155,0.3)]"
          >
             <Hexagon className="w-5 h-5 text-white stroke-[2.5]" fill="currentColor" fillOpacity={0.2} />
          </motion.div>
          <h1 className="font-bold text-[18px] tracking-tight text-[#1a273b]">TaxMind AI</h1>
        </div>
        <button onClick={onCloseSidebar} className="p-2 text-[#53637a] hover:text-[#1a273b] hover:bg-white/60 rounded-xl transition-all hidden md:block">
          <PanelLeftClose className="w-5 h-5" />
        </button>
      </div>

      <div className="px-3 pb-2 pt-4">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-between text-white py-3 px-4 rounded-2xl transition-all bg-[#1a273b] hover:bg-[#111b2b] shadow-lg group mb-3"
        >
          <div className="flex items-center space-x-3">
             <div className="p-0.5 rounded-lg group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 text-white stroke-[3]" />
             </div>
             <span className="font-bold tracking-wide text-[14px]">New Chat</span>
          </div>
        </button>

        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[#8999af]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history..."
            className="w-full bg-white/60 hover:bg-white focus:bg-white border border-[#e2e8f0] text-[#1a273b] placeholder:text-[#8999af] text-[13px] font-medium rounded-xl pl-9 pr-3 py-2.5 outline-none transition-all focus:ring-2 focus:ring-[#609BBB]/20"
          />
        </div>
      </div>

      {/* Main Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 subtle-scroll">
        
        {Object.entries(groupedHistory).map(([group, items]) => items.length > 0 && (
          <div key={group} className="animate-in fade-in slide-in-from-left-2 duration-300">
            <p className="text-[11px] font-bold text-[#8999af] mb-3 px-3 tracking-widest uppercase">{group}</p>
            <div className="space-y-1">
              <AnimatePresence>
                {items.map((chat) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectHistory && onSelectHistory(chat.id);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left group border cursor-pointer relative z-20 ${
                        activeHistoryId === chat.id 
                          ? 'bg-[#f0f7fb] text-[#3A759B] border-[#e2e8f0]' 
                          : 'text-[#53637a] hover:bg-[#f8fafc] hover:text-[#1a273b] border-transparent hover:border-[#f1f5f9]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 overflow-hidden flex-1 pointer-events-none">
                        <span className="truncate text-[14px] font-semibold transition-colors group-hover:pl-0.5 transition-all pointer-events-none">{chat.title}</span>
                      </div>
                      <button 
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-orange-50 rounded-lg text-[#8999af] hover:text-[#F87C71] transition-all shadow-sm relative z-30"
                        onClick={(e) => handleDelete(e, chat.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#f1f5f9] bg-white/40">
        <div 
          onClick={() => setIsProfileOpen(true)} 
          className="flex items-center space-x-3 px-3 py-3 w-full hover:bg-white rounded-2xl cursor-pointer transition-all group border border-transparent hover:border-[#f1f5f9] shadow-sm hover:shadow-md"
        >
          <div className="w-9 h-9 rounded-full bg-[#F87C71] flex items-center justify-center text-white font-bold text-[13px] ring-2 ring-white shadow-lg shrink-0">
            KK
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-start">
             <p className="text-[14px] font-bold text-[#1a273b] truncate text-left w-full">Kartik khandelwal</p>
             <p className="text-[11px] text-[#8999af] font-medium truncate text-left">Starter</p>
          </div>
          <MoreHorizontal className="w-5 h-5 text-[#8999af] group-hover:text-[#1a273b] transition-colors shrink-0" />
        </div>
      </div>
    </div>
  );
}
