import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in required fields');
      return;
    }
    toast.success('Your message has been sent! Our customer support team will reply within 24 hours.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-lg mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          Get in Touch
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Have questions about an order, author collaborations, or wholesale inquiries? We are always here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-brand-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Contact Information
          </h2>

          <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-white block">Headquarters Office:</strong>
                <span>Block 4, Tech Innovation Hub, Outer Ring Road, Bengaluru, Karnataka 560103, India</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-white block">Customer Helpline:</strong>
                <span>+91 (800) 456-7890 (Mon - Sat, 9:00 AM - 7:00 PM IST)</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-white block">Email Support:</strong>
                <span>support@bookcart.com / orders@bookcart.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-brand-200/80 dark:border-slate-800 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-50/50 dark:bg-slate-800 border border-brand-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-50/50 dark:bg-slate-800 border border-brand-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Subject
              </label>
              <input
                type="text"
                placeholder="How can we assist you?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-brand-50/50 dark:bg-slate-800 border border-brand-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Your Message *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Write your query or message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3.5 bg-brand-50/50 dark:bg-slate-800 border border-brand-200 dark:border-slate-700 rounded-xl text-xs leading-relaxed text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-8 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-105"
            >
              <span>Send Message</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
