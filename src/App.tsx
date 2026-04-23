import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Chat } from './components/Chat';
import { mockClients, clientMockData, initialExtensiveChat, mockHistoryChats } from './services/mockData';
import { Menu, Hexagon, X, Users, Bell, Zap, Shield, Trash2 as TrashIcon, CreditCard, ChevronRight, FileText, Database, Calculator, HelpCircle, Search, Check, Sparkles, Landmark, ZapOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Client, Message } from './types';

// Light Animated Splash Screen
const SplashScreen = () => (
  <motion.div
    exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
    className="fixed inset-0 z-[100] bg-[#f8fafc] flex flex-col items-center justify-center overflow-hidden"
  >
    <div className="absolute inset-0 opacity-40 pointer-events-none">
      <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#F87C71]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#F87C71]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s' }} />
    </div>

    {/* Floating Data Visualizations */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
       <motion.div 
         initial={{ y: 50, x: -50, opacity: 0, rotate: -15 }} 
         animate={{ y: -120, x: -180, opacity: 1, rotate: -5 }} 
         transition={{ duration: 2, ease: "easeOut" }} 
         className="absolute w-32 h-32 bg-white/40 backdrop-blur-md rounded-3xl shadow-xl flex items-center justify-center border border-white"
       >
         <FileText className="w-12 h-12 text-[#3A759B] opacity-80" />
       </motion.div>

       <motion.div 
         initial={{ y: -50, x: 50, opacity: 0, rotate: 15 }} 
         animate={{ y: 120, x: 180, opacity: 1, rotate: 5 }} 
         transition={{ delay: 0.2, duration: 2, ease: "easeOut" }} 
         className="absolute w-28 h-28 bg-white/40 backdrop-blur-md rounded-[32px] shadow-xl flex items-center justify-center border border-white"
       >
         <Database className="w-10 h-10 text-[#F87C71] opacity-80" />
       </motion.div>

       <motion.div 
         initial={{ y: 100, x: 50, opacity: 0, rotate: -20 }} 
         animate={{ y: -80, x: 200, opacity: 1, rotate: 10 }} 
         transition={{ delay: 0.4, duration: 2, ease: "easeOut" }} 
         className="absolute w-20 h-20 bg-white/40 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center border border-white"
       >
         <Calculator className="w-8 h-8 text-[#F87C71] opacity-80" />
       </motion.div>
    </div>

    <motion.div initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-10 flex flex-col items-center">
      <div className="w-28 h-28 mb-8 rounded-[40px] bg-white backdrop-blur-xl shadow-[0_20px_50px_rgba(58,117,155,0.3)] flex items-center justify-center border border-white ring-[10px] ring-white/50">
        <div className="relative w-14 h-14">
           <div className="absolute inset-0 bg-gradient-to-tr from-[#3A759B] to-[#F87C71] rounded-full blur-[10px] opacity-80 animate-pulse" />
           <div className="absolute inset-0 bg-gradient-to-br from-[#609BBB] to-[#3A759B] rounded-full shadow-[inset_0_0_15px_rgba(255,255,255,0.9)] flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
           </div>
        </div>
      </div>
      <h1 className="text-[44px] font-extrabold text-[#1a273b] tracking-tight text-center leading-tight">TaxMind <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3A759B] to-[#F87C71]">AI</span></h1>
      <p className="text-[17px] text-[#53637a] font-medium mt-3 text-center max-w-[280px] leading-relaxed">Securing connection to client registers & GST portal...</p>
      
      <motion.div className="mt-12 w-56 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#3A759B] to-[#F87C71]"
        />
      </motion.div>
    </motion.div>
  </motion.div>
);

// Settings Modal (Converted from Drawer)
const SettingsDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [retentionDays, setRetentionDays] = useState(30);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex justify-center items-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#1a273b]/40 backdrop-blur-sm cursor-pointer" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white w-full max-w-2xl h-auto max-h-[90vh] shadow-2xl rounded-[32px] relative z-10 flex flex-col border border-white/20 overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#f1f5f9] bg-[#f8fafc]">
              <h2 className="font-bold text-xl text-[#1a273b]">Settings & Profile</h2>
              <button onClick={onClose} className="p-2 hover:bg-[#ebe9f2] rounded-xl text-[#6b6684] transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 subtle-scroll space-y-8">
              
              {/* Profile Card */}
              <div className="flex items-center space-x-4 bg-[#f8fafc] p-5 rounded-3xl border border-[#f1f5f9]">
                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#609BBB] to-[#3A759B] flex items-center justify-center text-white text-xl font-bold shadow-lg">KA</div>
                 <div>
                   <h3 className="text-xl font-bold text-[#1a273b]">Kartik</h3>
                   <p className="text-[#53637a] font-medium text-[13px]">Taxation Professional</p>
                   <p className="text-sm text-[#3A759B] font-bold mt-1 cursor-pointer hover:underline">Edit Profile</p>
                 </div>
              </div>

              {/* Tokens & Usage */}
              <div>
                <h4 className="text-[11px] font-bold text-[#8999af] uppercase tracking-widest mb-4">Usage & Tokens</h4>
                <div className="p-5 rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
                   <div className="flex justify-between items-end mb-2">
                     <div>
                       <p className="font-bold text-[#1a273b]">Billing Cycle</p>
                       <p className="text-[12px] text-[#53637a] mt-1">Ends in 12 days</p>
                     </div>
                     <p className="text-sm font-bold text-[#3A759B]">542k / 1M Tokens</p>
                   </div>
                   <div className="h-2 w-full bg-[#f1f5f9] rounded-full overflow-hidden mt-3">
                     <div className="h-full bg-gradient-to-r from-[#3A759B] to-[#609BBB] w-[54%]" />
                   </div>
                   <button className="mt-4 text-[13px] font-bold text-[#1a273b] hover:text-[#3A759B] transition-colors flex items-center space-x-1">
                     <CreditCard className="w-4 h-4 mr-2 text-[#8999af]" /> Manage Plan
                   </button>
                </div>
              </div>

              {/* Data Management */}
              <div>
                <h4 className="text-[11px] font-bold text-[#8999af] uppercase tracking-widest mb-4">Data Management</h4>
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc]">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-3">
                        <TrashIcon className="w-5 h-5 text-[#8999af]" />
                        <span className="font-bold text-[#1a273b]">Auto-Archive Chats</span>
                      </div>
                      <span className="text-[13px] font-bold bg-[#f1f5f9] px-2 py-1 rounded text-[#53637a]">{retentionDays} Days</span>
                    </div>
                    <input 
                      type="range" min="7" max="90" step="1" value={retentionDays} 
                      onChange={(e) => setRetentionDays(Number(e.target.value))}
                      className="w-full accent-[#3A759B] cursor-pointer" 
                    />
                    <p className="text-[12px] text-[#8999af] mt-3">Chats older than {retentionDays} days will be automatically archived from your active workspace.</p>
                  </div>
                  
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-[#f8fafc] transition-all group border border-transparent hover:border-[#f1f5f9]">
                    <div className="flex items-center space-x-3"><Users className="w-5 h-5 text-[#3A759B]" /><span className="font-bold text-[#1a273b]">Team Management (3 Users)</span></div>
                    <ChevronRight className="w-4 h-4 text-[#8999af]" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-[#f8fafc] transition-all group border border-transparent hover:border-[#f1f5f9]">
                    <div className="flex items-center space-x-3"><Shield className="w-5 h-5 text-[#3A759B]" /><span className="font-bold text-[#1a273b]">API & GST Credentials</span></div>
                    <ChevronRight className="w-4 h-4 text-[#8999af]" />
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h4 className="text-[11px] font-bold text-[#8999af] uppercase tracking-widest mb-4">Notifications</h4>
                <div className="p-5 rounded-2xl border border-[#e2e8f0] bg-white space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#1a273b] text-[14px]">Email Alerts</p>
                      <p className="text-[12px] text-[#53637a]">Receive responses and report links</p>
                    </div>
                    <button onClick={() => setNotifyEmail(!notifyEmail)} className={`w-11 h-6 rounded-full transition-colors relative ${notifyEmail ? 'bg-[#3A759B]' : 'bg-[#e2e8f0]'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifyEmail ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="w-full h-px bg-[#f1f5f9]" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#1a273b] text-[14px]">Push Notifications</p>
                      <p className="text-[12px] text-[#53637a]">Live alerts on screen for completed audits</p>
                    </div>
                    <button onClick={() => setNotifyPush(!notifyPush)} className={`w-11 h-6 rounded-full transition-colors relative ${notifyPush ? 'bg-[#3A759B]' : 'bg-[#e2e8f0]'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifyPush ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Legal */}
              <div className="flex flex-wrap gap-2 text-[12px] font-bold text-[#8999af]">
                 <a href="#" className="hover:text-[#3A759B] underline underline-offset-2">Terms & Conditions</a>
                 <span>•</span>
                 <a href="#" className="hover:text-[#3A759B] underline underline-offset-2">Privacy Policy</a>
                 <span>•</span>
                 <a href="#" className="hover:text-[#3A759B] underline underline-offset-2">Disclaimers</a>
              </div>

              {/* Danger Zone */}
              <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100 mt-8">
                <p className="text-xs font-bold text-orange-600 mb-1">Danger Zone</p>
                <p className="text-[13px] text-[#F87C71] font-medium mb-3">Permanent deletion of account data and workspace history.</p>
                <button className="w-full py-2 bg-white text-orange-600 font-bold rounded-xl border border-orange-200 hover:bg-orange-50 transition-colors">Terminate Workspace</button>
              </div>
            </div>

            <div className="p-6 border-t border-[#f1f5f9] bg-[#f8fafc]">
              <button className="w-full py-3.5 bg-[#1a273b] hover:bg-[#111b2b] text-white rounded-2xl font-bold shadow-lg transition-all">Sign Out</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const PersonalizationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex justify-center items-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#1a273b]/40 backdrop-blur-sm cursor-pointer" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto subtle-scroll rounded-[32px] shadow-2xl relative z-10 flex flex-col border border-white/20 p-8"
          >
             <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-[#ebe9f2] rounded-full text-[#6b6684] transition-colors bg-white z-10 shadow-sm"><X className="w-6 h-6" /></button>
             
             <div className="mb-8">
               <h2 className="text-2xl font-bold text-[#1a273b] mb-2 tracking-tight">Personalization Settings</h2>
               <p className="text-sm text-[#53637a] font-medium">Tailor TaxMind AI's responses and display behavior to fit your workflow.</p>
             </div>

             <div className="space-y-6">
                <div>
                  <label className="text-[12px] font-bold text-[#8999af] uppercase tracking-widest mb-3 block">Language Preference</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center space-x-2 py-3 bg-[#f0f7fb] border-2 border-[#3A759B] rounded-xl text-[#3A759B] font-bold"><Check className="w-4 h-4"/><span>English</span></button>
                    <button className="flex items-center justify-center space-x-2 py-3 bg-white border border-[#e2e8f0] text-[#53637a] hover:bg-[#f8fafc] rounded-xl font-bold transition-colors"><span>Hindi</span></button>
                  </div>
                </div>
                
                <div className="w-full h-px bg-[#f1f5f9]" />

                <div>
                  <label className="text-[12px] font-bold text-[#8999af] uppercase tracking-widest mb-3 block">Response Verbosity</label>
                  <div className="space-y-3">
                     <label className="flex items-center p-4 border border-[#e2e8f0] rounded-2xl cursor-pointer hover:bg-[#f8fafc] transition-colors">
                        <input type="radio" name="verbosity" className="w-4 h-4 text-[#3A759B] border-gray-300 focus:ring-[#3A759B]" />
                        <div className="ml-3">
                           <p className="font-bold text-[#1a273b]">Concise & Direct</p>
                           <p className="text-xs text-[#53637a]">Only straight facts and raw figures. Best for rapid processing.</p>
                        </div>
                     </label>
                     <label className="flex items-center p-4 border-2 border-[#3A759B] bg-[#f0f7fb] rounded-2xl cursor-pointer transition-colors">
                        <input type="radio" name="verbosity" defaultChecked className="w-4 h-4 text-[#3A759B] border-gray-300 focus:ring-[#3A759B]" />
                        <div className="ml-3">
                           <p className="font-bold text-[#1a273b]">Detailed Analysis (Recommended)</p>
                           <p className="text-xs text-[#53637a]">Includes context, section references, and step-by-step logic.</p>
                        </div>
                     </label>
                  </div>
                </div>

                <div className="w-full h-px bg-[#f1f5f9]" />

                <div>
                  <label className="text-[12px] font-bold text-[#8999af] uppercase tracking-widest mb-3 block">Data Visualization</label>
                  <div className="flex items-center justify-between p-4 border border-[#e2e8f0] rounded-2xl">
                     <div>
                       <p className="font-bold text-[#1a273b] text-[14px]">Auto-generate Charts</p>
                       <p className="text-[12px] text-[#53637a]">Automatically map numeric data into visual graphs</p>
                     </div>
                     <button className="w-11 h-6 rounded-full transition-colors relative bg-[#3A759B]">
                       <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-6 transition-all" />
                     </button>
                  </div>
                </div>
             </div>

             <div className="mt-8 flex justify-end space-x-3">
                <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-[#53637a] font-bold hover:bg-[#f8fafc] transition-colors">Cancel</button>
                <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-[#1a273b] text-white font-bold hover:bg-black transition-colors shadow-lg">Save Preferences</button>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
const UpgradeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex justify-center items-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#1a273b]/40 backdrop-blur-sm cursor-pointer" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto subtle-scroll rounded-[32px] shadow-2xl relative z-10 flex flex-col border border-white/20 p-8"
          >
             <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-[#ebe9f2] rounded-full text-[#6b6684] transition-colors bg-white z-10 shadow-sm"><X className="w-6 h-6" /></button>
             
             <div className="text-center mb-10 mt-4">
               <h2 className="text-3xl font-bold text-[#1a273b] mb-3 tracking-tight">Level up your tax workflows</h2>
               <p className="text-lg text-[#53637a] max-w-2xl mx-auto font-medium">Choose a plan that scales with your CA firm. Upgrade anytime.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Starter Plan */}
                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[24px] p-6 flex flex-col relative overflow-hidden">
                   <div className="absolute top-0 inset-x-0 h-1 bg-[#8999af]" />
                   <h3 className="text-xl font-bold text-[#1a273b] mb-2">Starter</h3>
                   <div className="flex items-baseline space-x-1 mb-4">
                      <span className="text-4xl font-bold tracking-tight text-[#1a273b]">₹0</span>
                      <span className="text-[#8999af] font-medium text-sm">/mo</span>
                   </div>
                   <p className="text-sm text-[#53637a] mb-6 min-h-[40px]">Perfect for individuals filing basic GST returns.</p>
                   <button className="w-full py-3 rounded-xl border-2 border-[#e2e8f0] text-[#53637a] font-bold bg-white mb-8 shadow-sm cursor-default">Current Plan</button>
                   <div className="space-y-4 flex-1">
                     <p className="text-xs font-bold text-[#1a273b] uppercase tracking-widest">Includes:</p>
                     {["100 AI Queries per month", "Manual CSV Uploads", "Standard Text Context", "Community Support"].map((f, i) => (
                       <div key={i} className="flex items-start space-x-3"><Check className="w-5 h-5 text-[#8999af] shrink-0" /><span className="text-sm text-[#53637a] font-medium leading-tight">{f}</span></div>
                     ))}
                   </div>
                </div>

                {/* Professional Plan (Highlighted) */}
                <div className="bg-white border-2 border-[#3A759B] rounded-[24px] p-6 flex flex-col relative shadow-[0_20px_40px_rgba(58,117,155,0.15)] scale-100 md:scale-105 z-10">
                   <div className="absolute top-0 right-0 bg-[#3A759B] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-bl-xl items-center flex space-x-1"><Sparkles className="w-3 h-3"/><span>Most Popular</span></div>
                   <h3 className="text-xl font-bold text-[#3A759B] mb-2 mt-4 md:mt-2">Professional</h3>
                   <div className="flex items-baseline space-x-1 mb-4">
                      <span className="text-4xl font-bold tracking-tight text-[#1a273b]">₹2,499</span>
                      <span className="text-[#8999af] font-medium text-sm">/mo</span>
                   </div>
                   <p className="text-sm text-[#53637a] mb-6 min-h-[40px]">For dedicated CAs handling multiple client portfolios.</p>
                   <button className="w-full py-3 rounded-xl bg-[#3A759B] hover:bg-[#2c5b7b] text-white font-bold mb-8 shadow-md transition-colors">Upgrade to Professional</button>
                   <div className="space-y-4 flex-1">
                     <p className="text-xs font-bold text-[#1a273b] uppercase tracking-widest">Everything in Starter, plus:</p>
                     {["Unlimited AI Queries", "Direct GST Portal Sync", "Voice Notes & Document OCR", "Draft Generation (Notices)", "Priority Email Support"].map((f, i) => (
                       <div key={i} className="flex items-start space-x-3"><Check className="w-5 h-5 text-[#3A759B] shrink-0" /><span className="text-sm text-[#1a273b] font-medium leading-tight">{f}</span></div>
                     ))}
                   </div>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-[#fcfdff] border border-[#e2e8f0] rounded-[24px] p-6 flex flex-col relative overflow-hidden">
                   <div className="absolute top-0 inset-x-0 h-1 bg-[#1a273b]" />
                   <h3 className="text-xl font-bold text-[#1a273b] mb-2">Enterprise</h3>
                   <div className="flex items-baseline space-x-1 mb-4">
                      <span className="text-4xl font-bold tracking-tight text-[#1a273b]">₹9,999</span>
                      <span className="text-[#8999af] font-medium text-sm">/mo</span>
                   </div>
                   <p className="text-sm text-[#53637a] mb-6 min-h-[40px]">Full-scale AI deployment for large tax compliance firms.</p>
                   <button className="w-full py-3 rounded-xl border border-[#cbd5e1] hover:border-[#1a273b] bg-white text-[#1a273b] font-bold mb-8 shadow-sm transition-colors">Contact Sales</button>
                   <div className="space-y-4 flex-1">
                     <p className="text-xs font-bold text-[#1a273b] uppercase tracking-widest">Everything in Pro, plus:</p>
                     {["Unlimited Team Seats", "Custom Compliance Models", "API Integration Access", "Dedicated Success Manager", "24/7 Phone Support"].map((f, i) => (
                       <div key={i} className="flex items-start space-x-3"><Check className="w-5 h-5 text-[#1a273b] shrink-0" /><span className="text-sm text-[#53637a] font-medium leading-tight">{f}</span></div>
                     ))}
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
const HelpDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex justify-center items-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#1a273b]/40 backdrop-blur-sm cursor-pointer" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white w-full max-w-2xl h-auto max-h-[90vh] shadow-2xl rounded-[32px] relative z-10 flex flex-col border border-white/20 overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#f1f5f9] bg-[#f8fafc]">
              <h2 className="font-bold text-xl text-[#1a273b]">Help & Support</h2>
              <button onClick={onClose} className="p-2 hover:bg-[#ebe9f2] rounded-xl text-[#6b6684] transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 subtle-scroll space-y-6">
              
              <div className="bg-[#f0f7fb] border border-[#e2e8f0] rounded-3xl p-5 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#3A759B] flex items-center justify-center text-white">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a273b]">TaxMind Knowledge Base</h3>
                    <p className="text-[12px] text-[#53637a]">Access 500+ GST scenarios</p>
                  </div>
                </div>
                <div className="relative mt-2">
                  <Search className="w-4 h-4 text-[#8999af] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search guides..." className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-[#e2e8f0] focus:ring-2 focus:ring-[#3A759B]/20 outline-none transition-all" />
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-[#8999af] uppercase tracking-widest mb-3">Popular Articles</h4>
                <div className="space-y-3">
                  {[
                    "How to resolve Section 61 Mismatches",
                    "Understanding Blocked ITC (Section 17)",
                    "Filing GST Refunds (RFD-01) offline",
                    "Adding new client GSTINs via Portal Sync"
                  ].map((title, i) => (
                    <button key={i} className="w-full text-left p-4 rounded-2xl hover:bg-[#f8fafc] border border-transparent hover:border-[#f1f5f9] transition-all group flex justify-between items-center bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <span className="text-[14px] font-medium text-[#1a273b] group-hover:text-[#3A759B] transition-colors">{title}</span>
                      <ChevronRight className="w-4 h-4 text-[#8999af]" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-[11px] font-bold text-[#8999af] uppercase tracking-widest mb-3">Contact Support</h4>
                <button className="w-full mb-3 flex items-center justify-center space-x-2 py-3.5 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#1a273b] rounded-2xl font-bold shadow-sm transition-all">
                  <FileText className="w-4 h-4" />
                  <span>Open Support Ticket</span>
                </button>
                <p className="text-center text-[12px] text-[#53637a]">Response time: Usually within 2 hours</p>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const LogoutWidget = ({ onOpenDialog }: { onOpenDialog: () => void }) => (
  <motion.button
    initial={{ scale: 0, rotate: -45 }}
    animate={{ scale: 1, rotate: 0 }}
    whileHover={{ scale: 1.1 }}
    onClick={onOpenDialog}
    className="fixed bottom-10 right-10 w-16 h-16 bg-white shadow-2xl rounded-2xl flex items-center justify-center border border-[#e2e8f0] z-[100] cursor-pointer"
  >
    <div className="relative">
      <Sparkles className="w-8 h-8 text-[#3A759B]" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
    </div>
  </motion.button>
);

const SystemStatusDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} className="absolute inset-0 bg-[#1a273b]/40 backdrop-blur-md" 
          />
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              width: isExpanded ? 'min(90%, 800px)' : '400px',
              height: isExpanded ? '600px' : 'auto'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[32px] shadow-2xl relative z-10 flex flex-col border border-white overflow-hidden p-8"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#1a273b]">System Re-Auth</h3>
                <p className="text-sm text-[#53637a] font-medium">Session has ended. Secure verify required.</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-[#f1f5f9] rounded-xl text-[#3A759B] transition-colors">
                  {isExpanded ? <ZapOff className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                </button>
                <button onClick={onClose} className="p-2 hover:bg-[#ebe9f2] rounded-xl text-[#6b6684] transition-colors"><X className="w-6 h-6" /></button>
              </div>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto subtle-scroll pr-2">
              <div className="p-5 bg-[#f8fafc] rounded-2xl border border-[#f1f5f9]">
                 <div className="flex items-center space-x-3 mb-4">
                    <Database className="w-5 h-5 text-[#3A759B]" />
                    <span className="font-bold text-[#1a273b]">Portal Status: Offline</span>
                 </div>
                 <div className="h-1.5 w-full bg-[#e2e8f0] rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 w-1/4" />
                 </div>
              </div>

              {isExpanded && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-[#53637a] leading-relaxed">
                    Your session was terminated due to security protocols. TaxMind AI maintains zero-trust architecture. Please log in again to sync with GSTN servers and access real-time client registers.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white border border-[#e2e8f0] rounded-xl shadow-sm">
                        <p className="text-xs font-bold text-[#8999af] uppercase mb-1">Encrypted Logs</p>
                        <p className="text-sm font-mono text-[#1a273b]">0x4AF92...01A</p>
                     </div>
                     <div className="p-4 bg-white border border-[#e2e8f0] rounded-xl shadow-sm">
                        <p className="text-xs font-bold text-[#8999af] uppercase mb-1">IP Node</p>
                        <p className="text-sm font-mono text-[#1a273b]">192.168.1.1</p>
                     </div>
                  </div>
                </motion.div>
              )}

              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-gradient-to-r from-[#3A759B] to-[#609BBB] text-white font-bold rounded-2xl shadow-xl hover:shadow-[#3A759B]/20 transition-all flex items-center justify-center space-x-2"
              >
                <Shield className="w-5 h-5" />
                <span>Secure Re-Login</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Persistence: Store chat sessions in memory for the duration of the web session
  const [sessions, setSessions] = useState<Record<string, Message[]>>(() => {
    return Object.keys(mockHistoryChats).reduce((acc, key) => {
      acc[key] = mockHistoryChats[key as keyof typeof mockHistoryChats];
      return acc;
    }, {} as Record<string, Message[]>);
  });

  const [history, setHistory] = useState([
    { id: '1', title: 'GSTR-3B Liability check', group: 'Today' },
    { id: '2', title: 'Notice u/s 61 Draft', group: 'Today' },
    { id: '3', title: 'Invoice reconciliation Q1', group: 'Yesterday' },
    { id: '4', title: 'ITC mismatch analysis', group: 'Previous 7 Days' },
    { id: '5', title: 'Annual return audit notes', group: 'Previous 7 Days' },
    { id: '6', title: 'Capital goods depreciation', group: 'Previous 30 Days' },
  ]);

  const handleMessagesChange = useCallback((newMessages: Message[]) => {
    const chatId = activeChatId || 'new';
    setSessions(prev => ({
      ...prev,
      [chatId]: newMessages
    }));
  }, [activeChatId]);

  const handleDeleteHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    setSessions(prev => {
      const newSessions = { ...prev };
      delete newSessions[id];
      return newSessions;
    });
    if (activeChatId === id) setActiveChatId(null);
  }, [activeChatId]);

  const handleFirstMessage = useCallback((text: string, firstMessages: Message[]) => {
    const newId = Date.now().toString();
    setHistory(prev => [{
      id: newId,
      title: text.length > 25 ? text.substring(0, 25) + '...' : text,
      group: 'Today'
    }, ...prev]);
    setActiveChatId(newId);
    setSessions(prev => ({
      ...prev,
      [newId]: firstMessages
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => clearTimeout(timer);
  }, []);

  const handleNewChat = () => {
    setActiveChatId(null);
    setIsMobileMenuOpen(false);
    setActiveClient(null);
  };

  const handleSelectHistory = (id: string) => {
    setActiveChatId(id);
    if (window.innerWidth < 768) setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedOut(true);
  };

  if (isLoggedOut) {
    return (
      <div className="flex h-screen w-full bg-[#f8fafc] items-center justify-center relative overflow-hidden font-sans">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#3A759B]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#F87C71]/10 rounded-full blur-[120px]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center z-10 p-8"
        >
          <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mx-auto mb-6 border border-[#e2e8f0]">
            <Landmark className="w-10 h-10 text-[#3A759B]" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#1a273b] mb-4">Session Terminated</h1>
          <p className="text-lg text-[#53637a] mb-8 max-w-md">Your workspace is now inactive. Secure logout complete.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-[#1a273b] text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-all"
          >
            Go to Welcome Screen
          </button>
        </motion.div>

        <LogoutWidget onOpenDialog={() => setIsStatusDialogOpen(true)} />
        <SystemStatusDialog isOpen={isStatusDialogOpen} onClose={() => setIsStatusDialogOpen(false)} />
      </div>
    );
  }

  const currentMessages = activeChatId ? sessions[activeChatId] || [] : sessions['new'] || [];

  return (
    <div className="flex h-screen w-full bg-[#fcfdff] font-sans relative overflow-hidden text-[#1a273b]">
      <AnimatePresence>
         {showSplash && <SplashScreen />}
      </AnimatePresence>

      {/* Massive Soft Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-gradient-to-b from-[#e2e8f0]/60 to-[#e2e8f0]/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-gradient-to-t from-[#fff0f0]/70 to-[#e2e8f0]/40 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[20px]" />
      </div>

      <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden absolute top-4 left-4 z-40 p-2.5 text-[#53637a] bg-white/80 backdrop-blur border border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl hover:bg-white transition-colors">
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <motion.div 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:block h-full z-20 overflow-hidden shrink-0 bg-white/60 backdrop-blur-xl border-r border-[#e2e8f0]"
      >
        <Sidebar 
          onNewChat={handleNewChat} 
          onOpenProfile={() => setIsSettingsOpen(true)} 
          onOpenUpgrade={() => setIsUpgradeOpen(true)}
          onOpenPersonalization={() => setIsPersonalizationOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)} 
          onLogout={handleLogout}
          onCloseSidebar={() => setIsSidebarOpen(false)} 
          history={history} 
          onSelectHistory={handleSelectHistory}
          activeHistoryId={activeChatId}
          onDeleteHistory={handleDeleteHistory} 
        />
      </motion.div>

      {/* Re-open Sidebar Button */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => setIsSidebarOpen(true)}
            className="hidden md:flex absolute top-5 left-5 z-20 p-2.5 text-[#6b6684] hover:text-[#1a273b] bg-white/80 backdrop-blur border border-white shadow-sm hover:shadow-md rounded-xl transition-all"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="md:hidden fixed inset-0 bg-[#1a273b]/20 z-40 backdrop-blur-sm" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="md:hidden fixed inset-y-0 left-0 z-50 w-[280px] shadow-[10px_0_40px_rgba(0,0,0,0.08)] bg-white/90 backdrop-blur-2xl border-r border-white">
              <Sidebar 
                onNewChat={handleNewChat} 
                onOpenProfile={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }} 
                onOpenUpgrade={() => { setIsUpgradeOpen(true); setIsMobileMenuOpen(false); }}
                onOpenPersonalization={() => { setIsPersonalizationOpen(true); setIsMobileMenuOpen(false); }}
                onOpenHelp={() => { setIsHelpOpen(true); setIsMobileMenuOpen(false); }} 
                onLogout={handleLogout}
                onCloseSidebar={() => setIsMobileMenuOpen(false)} 
                history={history} 
                onSelectHistory={handleSelectHistory}
                activeHistoryId={activeChatId}
                onDeleteHistory={handleDeleteHistory} 
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 h-full min-w-0 bg-transparent z-10 relative flex flex-col">
         {/* Let Chat handle its own scrolling and max width, allowing its scrollbar to hit the screen edge */}
         <Chat 
           clients={mockClients} 
           activeClient={activeClient} 
           onSelectClient={setActiveClient} 
           clientData={activeClient ? clientMockData[activeClient.id] : null} 
           isSidebarOpen={isSidebarOpen}
           onFirstMessage={handleFirstMessage}
           initialMessages={currentMessages}
           onMessagesChange={handleMessagesChange}
         />
      </main>

      {/* Drawers & Modals */}
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <HelpDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
      <PersonalizationModal isOpen={isPersonalizationOpen} onClose={() => setIsPersonalizationOpen(false)} />
    </div>
  );
}
