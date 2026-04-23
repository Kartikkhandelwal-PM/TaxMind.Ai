import React, { useState, useRef, useEffect } from 'react';
import { Client, Message, MockData } from '../types';
import { Download, FileText, Loader2, Sparkles, Check, Calculator, Landmark, LineChart, Plus, Copy, Image as ImageIcon, ThumbsUp, ThumbsDown, RefreshCw, X, ArrowUp, Edit3, Mic, Volume2, Shield, Briefcase, Play, Pause, AlertTriangle, ZapOff, Info, Database } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithTaxBot } from '../services/geminiService';
import { initialExtensiveChat } from '../services/mockData';

interface ChatProps {
  clients: Client[];
  activeClient: Client | null;
  onSelectClient: (client: Client | null) => void;
  clientData: MockData | null;
  isSidebarOpen: boolean;
  onFirstMessage?: (text: string, messages: Message[]) => void;
  initialMessages?: Message[];
  onMessagesChange?: (messages: Message[]) => void;
}

const statusText = ["Analyzing Records...", "Optimizing Tax Logic...", "Fetching Compliance Data...", "Grounding Context..."];

export function Chat({ clients, activeClient, onSelectClient, clientData, isSidebarOpen, onFirstMessage, initialMessages = [], onMessagesChange }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  
  // Ref to track the last initialMessages processed to avoid resetting on re-renders
  const lastInitialMessagesRef = useRef<Message[]>(initialMessages);

  // Slash command / attachment states
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [slashIndex, setSlashIndex] = useState(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  // Feedback / Edit states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'up' | 'down'>>({});
  const [feedbackToast, setFeedbackToast] = useState<{ id: string, type: 'up' | 'down' } | null>(null);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');
  const [previewDoc, setPreviewDoc] = useState<{ name: string; size: string } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isUpdatingFromApp = useRef(false);

  useEffect(() => {
    // Only update messages if initialMessages has actually changed in length or content
    if (JSON.stringify(initialMessages) !== JSON.stringify(lastInitialMessagesRef.current)) {
      isUpdatingFromApp.current = true;
      setMessages(initialMessages);
      lastInitialMessagesRef.current = initialMessages;
    }
  }, [initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setStatusIndex(prev => (prev + 1) % statusText.length);
      }, 1500);
    } else {
      setStatusIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(slashQuery.toLowerCase()) || 
    c.gstin.includes(slashQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;

    const match = val.match(/(?:^|\s)\/([a-zA-Z0-9\s]*)$/);
    if (match) {
      setShowSlashMenu(true);
      setSlashQuery(match[1]);
      setSlashIndex(0);
    } else {
      setShowSlashMenu(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSlashMenu) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSlashIndex(prev => (prev + 1) % filteredClients.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSlashIndex(prev => (prev - 1 + filteredClients.length) % filteredClients.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (filteredClients.length > 0) {
          executeSlash(filteredClients[slashIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowSlashMenu(false);
      }
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const executeSlash = (client: Client) => {
    onSelectClient(client);
    const inputParts = input.split(/(?:^|\s)\/[a-zA-Z0-9\s]*$/);
    const prefix = inputParts[0] || '';
    setInput(prefix + (prefix.length > 0 ? " " : ""));
    setShowSlashMenu(false);
  };

  const startEditing = (msg: Message) => {
    // Fill main input and setup state to override from this message point
    setInput(msg.content);
    setEditingMsgId(msg.id);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const cancelEditing = () => {
    setEditingMsgId(null);
    setInput('');
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (msgId: string, type: 'up' | 'down') => {
    setFeedbackState(prev => ({ ...prev, [msgId]: type }));
    setFeedbackToast({ id: msgId, type });
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleSendVoice = async (text: string) => {
    if (isLoading || !text.trim()) return;
    setShowSlashMenu(false);
    setShowAttachMenu(false);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      type: 'voice',
      voiceDuration: "0:" + Math.floor(Math.random() * 40 + 10).toString().padStart(2, '0') // random 10-50s
    };

    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '', 
      timestamp: new Date().toISOString()
    };

    // Store the conversation history at this moment
    const historyToPoint = messages;
    
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setIsLoading(true);

    try {
      await chatWithTaxBot(
        historyToPoint,
        text, 
        activeClient, 
        clientData, 
        (streamedContent) => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMsgId ? { ...msg, content: streamedContent } : msg
          ));
        }
      );
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Sorry, an error occurred analyzing this data. Please try again.";
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId ? { ...msg, content: `⚠️ **Error:** ${errorMessage}` } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (onMessagesChange) {
      if (isUpdatingFromApp.current) {
        isUpdatingFromApp.current = false;
        return;
      }
      onMessagesChange(messages);
    }
  }, [messages, onMessagesChange]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;
    
    setShowSlashMenu(false);
    setShowAttachMenu(false);

    let baseHistory = messages;
    
    if (editingMsgId) {
       const msgIndex = messages.findIndex(m => m.id === editingMsgId);
       if (msgIndex !== -1) {
          baseHistory = messages.slice(0, msgIndex);
       }
       setEditingMsgId(null);
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '', 
      timestamp: new Date().toISOString()
    };

    const newMessages = [...baseHistory, userMsg, assistantMsg];
    
    if (baseHistory.length === 0 && onFirstMessage) {
      onFirstMessage(text, newMessages);
    }

    setMessages(newMessages);
    setInput('');
    if (inputRef.current) {
        inputRef.current.style.height = 'auto';
        inputRef.current.focus();
    }
    setIsLoading(true);

    try {
      await chatWithTaxBot(
        baseHistory, 
        text, 
        activeClient, 
        clientData, 
        (streamedContent) => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMsgId ? { ...msg, content: streamedContent } : msg
          ));
        }
      );

      // Trigger notification if tab is hidden
      if (document.hidden && Notification.permission === "granted") {
        new Notification("TaxMind AI", {
          body: "Assistant has responded to your query.",
          icon: "/favicon.ico"
        });
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Sorry, an error occurred analyzing this data. Please try again.";
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId ? { ...msg, content: `⚠️ **Error:** ${errorMessage}` } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (msg: Message) => {
    const { content, type } = msg;

    if (type === 'alert') {
      return (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-5 shadow-sm text-red-900 flex items-start space-x-4">
          <div className="bg-white p-2 rounded-xl shrink-0 shadow-sm">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-[16px] text-red-800 mb-1">Compliance Alert</h4>
            <div className="text-[15px] leading-relaxed">
              <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
            </div>
          </div>
        </div>
      );
    }

    if (type === 'limit') {
      return (
        <div className="bg-orange-50 border border-orange-200 rounded-[28px] p-5 shadow-sm flex items-start space-x-4 max-w-2xl">
          <div className="bg-white p-2 rounded-xl shrink-0 shadow-sm">
            <ZapOff className="w-6 h-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-[16px] text-orange-850 mb-1">Usage Limit Reached</h4>
            <div className="text-[15px] leading-relaxed text-orange-800">
              <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
            </div>
            <button className="mt-4 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm transition-colors shadow-lg">
              Upgrade to Pro Plan
            </button>
          </div>
        </div>
      );
    }

    if (type === 'clarification') {
      return (
        <div className="bg-white border border-[#e2e8f0] rounded-[24px] p-5 shadow-sm max-w-2xl">
          <div className="flex items-start space-x-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
               <Info className="w-4 h-4" />
             </div>
             <p className="text-[15px] text-[#1a273b] pt-1 leading-relaxed font-medium">
               {content}
             </p>
          </div>
          <div className="flex flex-col space-y-2 pl-11">
             {[
               "Supplier delayed filing GSTR-1",
               "Mistake in claiming ITC in previous month",
               "Invoices uploaded in incorrect GSTIN",
               "Goods in transit / Received in next month"
             ].map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(opt)} 
                  className="text-left w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] hover:border-[#609BBB] hover:bg-[#f0f7fb] text-[14px] text-[#53637a] hover:text-[#1a273b] transition-all font-medium"
                >
                  {opt}
                </button>
             ))}
          </div>
        </div>
      );
    }

    if (type === 'tabular') {
      return (
        <div className="prose porange-slate max-w-none text-[#1a273b]">
          <div className="bg-white rounded-[24px] border border-[#e2e8f0] overflow-hidden shadow-sm">
            <div className="bg-[#f8fafc] px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
               <div className="flex items-center space-x-2">
                 <Database className="w-4 h-4 text-[#3A759B]" />
                 <span className="font-bold text-[13px] text-[#1a273b]">Data Explorer</span>
               </div>
               <button className="text-[12px] font-bold text-[#3A759B] hover:underline">Export CSV</button>
            </div>
            <div className="p-5 overflow-x-auto subtle-scroll">
              <div className="min-w-max">
                <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (type === 'irrelevant') {
      return (
        <div className="bg-neutral-50 border border-neutral-200 rounded-[28px] p-5 shadow-sm flex items-start space-x-4 max-w-2xl">
          <div className="bg-white p-2 rounded-xl shrink-0 shadow-sm border border-neutral-100">
            <ZapOff className="w-6 h-6 text-neutral-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-[16px] text-neutral-800 mb-1">Out of Scope</h4>
            <div className="text-[15px] leading-relaxed text-neutral-600">
              <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="markdown-body prose porange-slate max-w-none porange-p:leading-relaxed porange-pre:bg-white porange-pre:border porange-pre:border-[#f1f5f9] porange-headings:text-[#1a273b]">
        <Markdown remarkPlugins={[remarkGfm]}>
          {content}
        </Markdown>
        {content.includes('Download') && (
           <div className="mt-5 flex flex-wrap gap-3">
             <div 
               onClick={() => setPreviewDoc({ name: 'Tax_Report_Export.pdf', size: '245 KB' })}
               className="group flex items-center space-x-3 bg-white border border-[#e2e8f0] p-3 rounded-2xl shadow-sm hover:shadow-[0_4px_20px_rgba(58,117,155,0.12)] hover:border-[#609BBB] transition-all cursor-pointer w-[280px]"
             >
                <div className="bg-red-50 p-2.5 rounded-xl text-red-500 group-hover:scale-105 transition-transform border border-red-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[14px] font-semibold text-[#1a273b] truncate group-hover:text-[#3A759B] transition-colors">Tax_Report_Export.pdf</p>
                   <p className="text-[11px] font-medium text-[#53637a] mt-0.5 uppercase tracking-wide">245 KB • Secure</p>
                </div>
                <Download className="w-4 h-4 text-[#8999af] group-hover:text-[#609BBB]" />
             </div>
           </div>
        )}
      </div>
    );
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full w-full relative">

      <div className={cn("flex-1 w-full relative overflow-y-auto subtle-scroll", messages.length > 0 ? "pt-4 px-2 sm:px-3" : "flex items-center justify-center")}>
        <div className="w-full max-w-[850px] mx-auto relative h-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full z-10 relative px-4 sm:px-6 overflow-hidden pb-32 sm:pb-40 pt-16 sm:pt-0 h-full">
             
             {/* Background Decoration */}
             <div className="absolute inset-0 pointer-events-none">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-[#609BBB]/20 to-transparent rounded-full blur-[80px]"
                />
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, -45, 0],
                    opacity: [0.05, 0.1, 0.05]
                  }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-l from-[#3A759B]/20 to-transparent rounded-full blur-[60px]"
                />
             </div>

             <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="relative mb-8 sm:mb-12 flex justify-center items-center w-full max-w-sm h-28 sm:h-32">
               {/* Center AI Orb */}
               <div className="absolute z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] sm:rounded-[36px] bg-white shadow-2xl flex items-center justify-center border border-white ring-[10px] sm:ring-[12px] ring-[#f1f5f9]/30">
                 <div className="relative w-12 h-12">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#3A759B] to-[#F87C71] rounded-full animate-ping opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#3A759B] to-[#F87C71] rounded-full blur-[6px] opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#609BBB] to-[#3A759B] rounded-full shadow-[inset_0_0_12px_rgba(255,255,255,0.7)] flex items-center justify-center">
                       <Sparkles className="w-6 h-6 text-white" />
                    </div>
                 </div>
               </div>

               {/* Floating Nodes */}
               <motion.div 
                 animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute left-4 top-0 w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center border border-white"
               >
                 <Landmark className="w-5 h-5 text-[#3A759B]" />
               </motion.div>
               <motion.div 
                 animate={{ y: [10, -10, 10], rotate: [0, -5, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute right-4 bottom-0 w-14 h-14 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center border border-white"
               >
                 <Calculator className="w-6 h-6 text-[#F87C71]" />
               </motion.div>
               <motion.div 
                 animate={{ y: [-5, 5, -5], scale: [1, 1.1, 1] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute left-16 bottom-2 w-8 h-8 bg-gradient-to-br from-[#F87C71] to-[#3A759B] rounded-lg shadow-md flex items-center justify-center"
               >
                 <LineChart className="w-4 h-4 text-white" />
               </motion.div>
             </motion.div>
             
             <motion.h1 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
               className="text-[32px] md:text-[42px] font-extrabold tracking-tight text-[#1a273b] text-center mb-4 leading-[1.2]"
             >
               I'm connected to your client database<br/>and the <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3A759B] via-[#609BBB] to-[#F87C71]">GST portal.</span>
             </motion.h1>

             <motion.p
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
               className="text-[#53637a] text-[16px] sm:text-[20px] font-medium text-center max-w-xl mx-auto leading-relaxed mb-6 px-4"
             >
               What do you need to look up or resolve today?
             </motion.p>
          </div>
        ) : (
          <div className="space-y-8 flex flex-col px-4 md:px-0">
            {messages.map((msg, idx) => {
              const showDate = idx === 0 || formatDate(messages[idx-1].timestamp) !== formatDate(msg.timestamp);
              
              return (
                <div key={msg.id} className="flex flex-col">
                  {showDate && (
                    <div className="flex justify-center mb-6 mt-2 opacity-50">
                      <span className="text-[11px] font-bold text-[#53637a] uppercase tracking-widest bg-[#f1f5f9] px-3 py-1 rounded-full">{formatDate(msg.timestamp)}</span>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    className={cn("flex flex-col w-full group", msg.role === 'user' ? "items-end" : "items-start")}
                  >
                    <div className={cn("flex flex-col max-w-[90%] md:max-w-[85%]", msg.role === 'user' ? "items-end" : "items-start")}>
                      
                      {msg.role === 'assistant' && (
                        <div className="flex items-center space-x-3 mb-3 pl-1">
                          <div className="relative w-8 h-8 rounded-xl bg-white shadow-sm border border-[#f1f5f9] flex items-center justify-center">
                             <Sparkles className="w-4 h-4 text-[#3A759B]" />
                          </div>
                          <span className="text-[14px] font-bold text-[#1a273b] tracking-tight">TaxMind Assistant</span>
                          <span className="text-[11px] text-[#8999af] font-medium font-mono">{formatTime(msg.timestamp)}</span>
                        </div>
                      )}

                      <div className={cn(
                        "relative text-[16px] leading-[1.7]",
                        msg.role === 'user' 
                          ? `px-6 py-4 bg-white text-[#1a273b] rounded-[28px] rounded-tr-[4px] font-medium border border-[#e2e8f0] shadow-sm group ${msg.type === 'voice' ? 'min-w-[200px]' : ''}` 
                          : "text-[#111b2b] w-full"
                      )}>
                        {msg.role === 'user' ? (
                          <>
                            {msg.type === 'voice' ? (
                              <div className="flex items-center space-x-3">
                                <button className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#3A759B] hover:bg-[#e2e8f0] transition-colors">
                                  <Play className="w-4 h-4 ml-1" />
                                </button>
                                <div className="flex-1 flex items-center space-x-1 h-8 opacity-60">
                                   {[...Array(12)].map((_, i) => (
                                      <div key={i} className="w-1 bg-[#1a273b] rounded-full" style={{ height: `${Math.max(10, Math.random() * 100)}%` }} />
                                   ))}
                                </div>
                                <span className="font-mono text-sm text-[#8999af] ml-2">{msg.voiceDuration || '0:00'}</span>
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            )}
                            
                            {idx === messages.length - 2 && msg.role === 'user' && msg.type !== 'voice' && ( // Only allow editing last user prompt
                              <button 
                                onClick={() => startEditing(msg)}
                                className="absolute -left-2 sm:-left-10 -top-9 sm:top-1/2 sm:-translate-y-1/2 p-2 rounded-xl bg-white/90 sm:bg-transparent opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all text-[#8999af] hover:text-[#1a273b] shadow-sm sm:shadow-none"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}
                            <span className="absolute -bottom-5 right-1 text-[10px] text-[#8999af] font-mono">{formatTime(msg.timestamp)}</span>
                          </>
                        ) : (
                           msg.content === '' && isLoading ? (
                              <div className="flex items-center space-x-3 h-8 bg-transparent px-2 w-fit">
                                 <Loader2 className="w-5 h-5 animate-spin text-[#3A759B]" />
                                 <span className="text-[14px] font-medium text-[#53637a] animate-pulse">{statusText[statusIndex]}</span>
                              </div>
                           ) : renderMessageContent(msg)
                        )}
                      </div>
                      
                      {msg.role === 'assistant' && msg.content !== '' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex flex-wrap items-center gap-2 pl-1 text-[#8999af]">
                          <button 
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="p-2 rounded-xl hover:bg-white transition-all shadow-sm active:scale-90"
                          >
                            {copiedId === msg.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => handleSend(messages[idx - 1]?.content || '')}
                            className="p-2 rounded-xl hover:bg-white transition-all shadow-sm active:scale-90"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <div className="hidden sm:block w-px h-5 bg-[#e2e8f0] mx-2" />
                          <button 
                            onClick={() => handleFeedback(msg.id, 'up')}
                            className={cn("p-2 rounded-xl transition-all shadow-sm", feedbackState[msg.id] === 'up' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "hover:bg-white border border-transparent")}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleFeedback(msg.id, 'down')}
                            className={cn("p-2 rounded-xl transition-all shadow-sm", feedbackState[msg.id] === 'down' ? "bg-orange-50 text-orange-600 border border-orange-100" : "hover:bg-white border border-transparent")}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                          
                          <AnimatePresence>
                            {feedbackToast?.id === msg.id && (
                              <motion.div 
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                                className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-[#f1f5f9] flex items-center space-x-2"
                              >
                                {feedbackToast.type === 'up' ? <ThumbsUp className="w-3 h-3 text-emerald-600" /> : <ThumbsDown className="w-3 h-3 text-orange-600" />}
                                <span className="text-[11px] font-bold text-[#53637a]">Feedback saved</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}

                    </div>
                  </motion.div>
                </div>
              );
            })}
            <div ref={messagesEndRef} className="h-40 shrink-0" />
          </div>
        )}
        </div>
      </div>

      {/* Repositioned Status Indicator - Small and Contextual just above input */}
      <div 
        className={cn(
          "fixed bottom-[102px] sm:bottom-[110px] right-0 flex justify-center pointer-events-none z-40 transition-all duration-300 px-4",
          isSidebarOpen ? "left-0 md:left-[280px]" : "left-0"
        )}
      >
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="px-4 py-2 rounded-2xl shadow-xl border border-[#e2e8f0] flex items-center space-x-3 pointer-events-auto bg-white/90 backdrop-blur-3xl"
            >
              <Loader2 className="w-4 h-4 animate-spin text-[#609BBB]" />
              <motion.span 
                key={statusIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="font-bold text-[12px] text-[#53637a] tracking-tight"
              >
                {statusText[statusIndex]}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Layout for Input - No pointer events unless on child */}
      <div 
        className={cn(
          "fixed bottom-0 right-0 flex flex-col justify-end pointer-events-none z-40 transition-all duration-300 bg-gradient-to-t from-[#fcfdff] via-[#fcfdff]/90 to-transparent pt-10 sm:pt-12 pb-4 sm:pb-5 px-3 sm:px-4 md:px-8",
          isSidebarOpen ? "left-0 md:left-[280px]" : "left-0"
        )}
      >
        <div className="w-full max-w-[800px] pointer-events-auto mx-auto flex flex-col">
          
          <AnimatePresence>
            {editingMsgId && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mb-2 w-full flex justify-end">
                <button 
                  onClick={cancelEditing} 
                  className="px-4 py-1.5 bg-white/90 backdrop-blur border border-[#e2e8f0] rounded-full text-[12px] font-bold text-[#53637a] hover:text-[#1a273b] hover:bg-[#f1f5f9] shadow-sm transition-colors"
                >
                  Cancel Edit
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {showSlashMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="mb-4 w-full max-w-[350px] bg-white border border-[#e2e8f0] rounded-3xl shadow-2xl overflow-hidden flex flex-col p-2 self-start md:ml-12"
              >
                <div className="px-4 py-2 border-b border-[#f1f5f9] mb-2">
                   <span className="text-[11px] font-bold text-[#8999af] uppercase tracking-widest">Select Client Context</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto subtle-scroll">
                  {filteredClients.map((c, i) => (
                    <button
                      key={c.id} onClick={() => executeSlash(c)} onMouseEnter={() => setSlashIndex(i)}
                      className={cn("w-full text-left px-4 py-3 rounded-2xl transition-all flex items-center justify-between", slashIndex === i ? "bg-[#f0f7fb]" : "hover:bg-[#f8fafc]")}
                    >
                      <div className="flex flex-col"><span className="font-bold text-[#1a273b]">{c.name}</span><span className="text-[11px] font-mono text-[#8999af]">{c.gstin}</span></div>
                      {slashIndex === i && <Check className="w-4 h-4 text-[#3A759B]" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showAttachMenu && (
              <motion.div
                 initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                 className="mb-4 w-full sm:w-auto self-start bg-white border border-[#e2e8f0] rounded-[24px] shadow-2xl p-2 flex flex-wrap sm:flex-nowrap gap-2 md:ml-2"
              >
                 <button className="flex-1 sm:flex-none flex flex-col items-center justify-center min-w-[84px] h-20 rounded-[16px] hover:bg-[#f8fafc] transition-all group">
                   <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform"><FileText className="w-5 h-5" /></div>
                   <span className="text-[11px] font-bold text-[#53637a]">Document</span>
                 </button>
                 <button className="flex-1 sm:flex-none flex flex-col items-center justify-center min-w-[84px] h-20 rounded-[16px] hover:bg-[#f8fafc] transition-all group">
                   <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform"><ImageIcon className="w-5 h-5" /></div>
                   <span className="text-[11px] font-bold text-[#53637a]">Image</span>
                 </button>
                 <button className="flex-1 sm:flex-none flex flex-col items-center justify-center min-w-[84px] h-20 rounded-[16px] hover:bg-[#f8fafc] transition-all group">
                   <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform"><Briefcase className="w-5 h-5" /></div>
                   <span className="text-[11px] font-bold text-[#53637a]">Client</span>
                 </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Pill Input */}
          <div className="bg-white/90 backdrop-blur-3xl border border-[#e2e8f0] flex flex-col p-2.5 rounded-[32px] shadow-[0_20px_50px_rgba(58,117,155,0.15)] focus-within:ring-4 focus-within:ring-[#609BBB]/10 transition-all group relative mt-auto">
            
            {/* Voice Node Overlay */}
            <AnimatePresence>
              {isVoiceActive && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 z-10 bg-white/95 backdrop-blur-md rounded-[32px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-0 border border-orange-100 shadow-[0_0_40px_rgba(248,124,113,0.15)]"
                >
                   <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                     <div className="relative flex items-center justify-center w-8 h-8">
                        <div className="absolute inset-0 bg-[#F87C71] rounded-full animate-ping opacity-20" />
                        <Mic className="w-5 h-5 text-[#F87C71] relative z-10 animate-pulse" />
                     </div>
                     <span className="font-bold text-[#1a273b] text-[15px]">Listening to context...</span>
                   </div>
                   <div className="flex items-center space-x-2 self-end sm:self-auto">
                     <div className="flex space-x-1 items-center h-8">
                       {[...Array(5)].map((_, idx) => (
                         <motion.div key={idx} animate={{ height: [8, 24, 8] }} transition={{ duration: 1, repeat: Infinity, delay: idx * 0.15 }} className="w-1.5 bg-orange-400 rounded-full" />
                       ))}
                     </div>
                     <button onClick={() => setIsVoiceActive(false)} className="ml-4 p-2 text-[#8999af] hover:text-[#F87C71] hover:bg-orange-50 transition-colors rounded-full">
                       <X className="w-5 h-5" />
                     </button>
                     <button 
                       onClick={() => {
                         setIsVoiceActive(false);
                         handleSendVoice("Voice note recorded");
                       }} 
                       className="p-2 text-white bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-full shadow-md ml-2"
                     >
                       <Check className="w-5 h-5" />
                     </button>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {activeClient && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-3 pb-2 pt-1 flex">
                  <div className="flex items-center max-w-full bg-[#f0f7fb] border border-[#e2e8f0] rounded-full px-3 py-1">
                    <Briefcase className="w-3.5 h-3.5 text-[#3A759B] mr-2" />
                    <span className="text-[12px] font-bold text-[#3A759B] truncate">{activeClient.name}</span>
                    <button onClick={() => onSelectClient(null)} className="ml-2 text-[#3A759B] hover:bg-[#e0ebf3] rounded-full p-0.5"><X className="w-3 h-3" /></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-end min-h-[44px]">
              <div className="flex-shrink-0 px-1">
                <button 
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="p-2 text-[#8999af] hover:bg-[#f1f5f9] rounded-full transition-colors flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              <textarea
                ref={inputRef} value={input} onChange={handleInputChange} onKeyDown={handleKeyDown}
                placeholder="Query GST portal, reconcile data, or ask tax assistant..."
                className="flex-1 min-w-0 bg-transparent border-0 focus:ring-0 resize-none scrollbar-hide py-2.5 px-2 sm:px-3 text-[14px] sm:text-[15px] outline-none text-[#1a273b] placeholder:text-[#8999af] font-medium leading-relaxed"
                style={{ height: '48px' }}
              />

              <div className="flex items-center shrink-0 pr-1 space-x-2">
                <button
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={cn("p-2.5 rounded-full transition-all flex items-center justify-center", isVoiceActive ? "bg-orange-100 text-[#F87C71] animate-pulse ring-4 ring-orange-50" : "text-[#8999af] hover:bg-[#f1f5f9]")}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleSend(input)} disabled={!input.trim() || isLoading}
                  className="w-[40px] h-[40px] flex items-center justify-center bg-gradient-to-br from-[#F87C71] to-[#3A759B] text-white rounded-full hover:opacity-90 transition-all disabled:opacity-40 shadow-xl"
                >
                  <ArrowUp className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {messages.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex flex-col items-center w-full pointer-events-none"
              >
                <div className="flex items-center justify-center space-x-2 text-[10px] sm:text-[11px] font-bold text-[#8999af] tracking-widest uppercase bg-white/40 backdrop-blur-md py-1.5 px-3 sm:px-4 rounded-full border border-[#f1f5f9] max-w-full">
                   <Shield className="w-3 h-3 text-[#3A759B]" />
                   <span className="text-center">TaxMind AI can make mistakes. Verify critical data at your end.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewDoc(null)} className="absolute inset-0 bg-[#1a273b]/60 backdrop-blur-md cursor-zoom-out" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-4xl h-[85vh] rounded-[28px] sm:rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col border border-white/20">
               <div className="p-4 sm:p-6 border-b border-[#f1f5f9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#f8fafc]">
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shadow-inner shrink-0"><FileText className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                    <div className="min-w-0"><h3 className="font-bold text-[#1a273b] truncate">{previewDoc.name}</h3><p className="text-xs text-[#53637a]">{previewDoc.size}</p></div>
                  </div>
                  <div className="flex w-full sm:w-auto justify-between sm:justify-start space-x-3">
                    <button className="px-4 py-3 bg-[#1a273b] text-white rounded-2xl shadow-lg hover:bg-black transition-all flex items-center space-x-2"><Download className="w-5 h-5" /><span className="text-sm font-bold">Download PDF</span></button>
                    <button onClick={() => setPreviewDoc(null)} className="p-3 hover:bg-[#f1f5f9] rounded-2xl text-[#53637a] transition-colors"><X className="w-6 h-6" /></button>
                  </div>
               </div>
               <div className="flex-1 bg-neutral-100 p-4 sm:p-8 flex flex-col items-center justify-center space-y-6">
                  <div className="w-full max-w-2xl aspect-[3/4] bg-white rounded-xl shadow-2xl flex items-center justify-center relative">
                     <div className="flex flex-col items-center text-center max-w-xs">
                        <FileText className="w-16 h-16 text-neutral-300 mb-4" />
                        <p className="font-bold text-neutral-400 px-4">PDF Reader Previewing Document Content...</p>
                        <div className="mt-8 space-y-2 w-full">
                           <div className="h-4 bg-neutral-50 rounded-full w-full" />
                           <div className="h-4 bg-neutral-50 rounded-full w-5/6" />
                           <div className="h-4 bg-neutral-50 rounded-full w-11/12" />
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
