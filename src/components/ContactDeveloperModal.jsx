import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Mail, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Code,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTemplates } from '../context/TemplateContext';

const ContactDeveloperModal = ({ isOpen, onClose, template, developer }) => {
  const navigate = useNavigate();
  const { currentUser, openAuth, showNotification } = useCart();
  const { startConversation } = useTemplates();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState('$500 - $1,500');
  const [timeline, setTimeline] = useState('1-2 weeks');
  const [clientEmail, setClientEmail] = useState(currentUser?.email || '');
  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdConvId, setCreatedConvId] = useState(null);

  if (!isOpen || !template) return null;

  const devName = developer?.name || template.developerName || 'Verified Developer';
  const devId = developer?.loginId || template.developerId;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const clientId = currentUser?.id || currentUser?.loginId || `client-${Date.now().toString().slice(-4)}`;
    const finalClientName = clientName.trim() || currentUser?.name || 'Client';
    const finalClientEmail = clientEmail.trim() || currentUser?.email || 'client@fusion.com';

    const convId = startConversation({
      clientId,
      clientName: finalClientName,
      clientEmail: finalClientEmail,
      developerId: devId,
      templateId: template.id,
      templateTitle: template.title,
      subject: subject.trim() || `Inquiry regarding ${template.title}`,
      budget,
      timeline,
      initialMessage: message.trim()
    });

    setCreatedConvId(convId);
    setIsSubmitted(true);
    showNotification(`Message dispatched to ${devName}! An email alert has been sent.`, 'success');
  };

  const handleGoToChat = () => {
    onClose();
    navigate('/dashboard?tab=chat');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Inquiry Dispatched!</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                Your message has been stored in the database and linked to <strong>{devName}</strong>. An automatic email notification has been dispatched to their inbox.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 text-xs text-left space-y-1">
              <p className="font-bold text-purple-900 dark:text-purple-200">Conversation Active in Dashboard:</p>
              <p className="text-gray-600 dark:text-gray-300">
                You can continue communicating with {devName} anytime directly inside your Client Dashboard Chat without external apps.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleGoToChat}
                className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Dashboard Chat</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3.5 bg-gray-100 dark:bg-navy-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Header / Developer Spotlight */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[11px] font-extrabold mb-2 border border-purple-200 dark:border-purple-800">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>Direct Developer Contact & Customization</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Message {devName}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Discuss custom requirements, project quotes, or adaptations for <strong>{template.title}</strong>.
              </p>
            </div>

            {/* Template & Developer Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-navy-950 border border-gray-100 dark:border-gray-800">
              <img
                src={template.image}
                alt={template.title}
                className="w-16 h-12 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
              />
              <div className="space-y-0.5 flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{template.title}</h4>
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span>Author: <strong className="text-purple-600 font-semibold">{devName}</strong></span>
                  <span className="font-mono text-gray-400">({devId})</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Subject / Project Scope</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={`e.g. Need customization on ${template.title} for SaaS launch`}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Estimated Budget</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="$200 - $500">$200 - $500 (Minor Tweaks)</option>
                    <option value="$500 - $1,500">$500 - $1,500 (Custom Sections & Integration)</option>
                    <option value="$1,500 - $3,500">$1,500 - $3,500 (Full Brand Redesign & Backend)</option>
                    <option value="$3,500+">$3,500+ (Enterprise Deployment)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Target Timeline</label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Urgent (< 1 week)">Urgent (&lt; 1 week)</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="2-4 weeks">2-4 weeks</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Message / Project Requirements
                </label>
                <textarea
                  rows="4"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your requirements, required integrations (e.g. Stripe, Supabase, Auth), timeline, or specific styling adjustments..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <Mail className="w-3.5 h-3.5 text-purple-600" />
                  <span>Triggers automatic email alert to author</span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message & Alert Developer</span>
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};

export default ContactDeveloperModal;
