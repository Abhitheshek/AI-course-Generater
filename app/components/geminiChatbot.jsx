"use client";
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, Settings, Trash2, Copy, ChevronDown } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "YOUR_API_KEY_HERE");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export default function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showSelectionButton, setShowSelectionButton] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [settings, setSettings] = useState({
    autoOpenOnSelection: false,
    autoQueryOnSelection: false,
    showSelectionButton: true
  });
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const settingsRef = useRef(null);
  const dropdownRef = useRef(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    
    // Clear selected text when chat is closed
    if (!isOpen) {
      setShowSelectionButton(false);
    }
  }, [isOpen]);

  // Listen for text selection
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        const text = selection.toString().trim();
        setSelectedText(text);
        
        if (settings.autoOpenOnSelection) {
          setIsOpen(true);
          setTimeout(() => {
            if (settings.autoQueryOnSelection) {
              setInputValue(`Tell me about: "${text}"`);
              handleAutoQuery(text);
            } else {
              setInputValue(`Tell me about: "${text}"`);
            }
          }, 100);
        } else if (settings.showSelectionButton) {
          setShowSelectionButton(!isOpen);
        }
      } else {
        setSelectedText('');
        setShowSelectionButton(false);
      }
    };

    const handleClickOutside = (event) => {
      if (selectedText && !isOpen && !event.target.closest('.selection-button')) {
        setShowSelectionButton(false);
      }
      
      if (showSettings && !event.target.closest('.settings-panel') && !event.target.closest('.settings-button')) {
        setShowSettings(false);
      }
      
      if (showDropdown && !event.target.closest('.chat-dropdown') && !event.target.closest('.main-button')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('keyup', handleSelectionChange);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('keyup', handleSelectionChange);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedText, isOpen, settings, showSettings, showDropdown]);

  // Handle escape key to close chat
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (showSettings) {
          setShowSettings(false);
        } else if (isOpen) {
          setIsOpen(false);
        } else if (showDropdown) {
          setShowDropdown(false);
        }
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, showSettings, showDropdown]);

  // Add animation when chat opens/closes
  useEffect(() => {
    if (chatContainerRef.current) {
      if (isOpen) {
        chatContainerRef.current.style.opacity = '0';
        chatContainerRef.current.style.transform = 'translateY(20px)';
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.style.opacity = '1';
            chatContainerRef.current.style.transform = 'translateY(0)';
          }
        }, 50);
      }
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setShowSelectionButton(false);
    }
    setShowSettings(false);
    setShowDropdown(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const openSettings = () => {
    setShowSettings(true);
    setShowDropdown(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const askAboutSelection = () => {
    if (selectedText) {
      setInputValue(`Tell me about: "${selectedText}"`);
      setIsOpen(true);
      setShowSelectionButton(false);
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleAutoQuery = async (text) => {
    if (!text || isLoading) return;
    
    const query = `Tell me about: "${text}"`;
    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await model.generateContent(query);
      const response = await result.response;
      const responseText = response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await model.generateContent(inputValue);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you today?' }
    ]);
  };

  const deleteMessage = (index) => {
    // Don't delete the first welcome message
    if (index === 0) return;
    
    setMessages(prev => {
      // If deleting a user message that has an AI response, delete both
      if (prev[index].role === 'user' && index + 1 < prev.length && prev[index + 1].role === 'assistant') {
        return [...prev.slice(0, index), ...prev.slice(index + 2)];
      }
      // If deleting an AI message that has a user query, delete both
      else if (prev[index].role === 'assistant' && index > 0 && prev[index - 1].role === 'user') {
        return [...prev.slice(0, index - 1), ...prev.slice(index + 1)];
      }
      // Otherwise just delete the single message
      else {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      }
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        // Show a brief "Copied!" tooltip or notification
        const tooltip = document.createElement('div');
        tooltip.textContent = 'Copied!';
        tooltip.className = 'fixed bg-gray-800 text-white px-2 py-1 rounded text-xs';
        tooltip.style.zIndex = '9999';
        document.body.appendChild(tooltip);
        
        // Position near the cursor
        const posX = window.event ? window.event.clientX : 0;
        const posY = window.event ? window.event.clientY : 0;
        tooltip.style.left = `${posX}px`;
        tooltip.style.top = `${posY - 30}px`;
        
        // Remove after a short delay
        setTimeout(() => {
          document.body.removeChild(tooltip);
        }, 1500);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Function to format code blocks in AI responses
  const formatCodeBlocks = (content) => {
    // Simple regex to identify code blocks (text between triple backticks)
    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)\n```/g;
    
    // Replace code blocks with formatted HTML
    return content.replace(codeBlockRegex, (match, language, code) => {
      return `<pre class="bg-gray-800 text-gray-100 p-3 rounded-md my-2 overflow-x-auto"><code class="language-${language || 'text'}">${code}</code></pre>`;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Selected text action button */}
      {showSelectionButton && selectedText && settings.showSelectionButton && (
        <button
          onClick={askAboutSelection}
          className="selection-button mb-4 bg-indigo-600 text-white rounded-full px-4 py-2 flex items-center shadow-lg hover:bg-indigo-700 transition-all duration-300 animate-fadeIn"
        >
          Ask about selection
        </button>
      )}
      
      {/* Settings panel */}
      {showSettings && (
        <div 
          ref={settingsRef}
          className="settings-panel absolute bottom-16 right-0 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 mb-2 animate-fadeIn"
        >
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <Settings size={16} className="mr-2" />
            Chatbot Settings
          </h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">Show selection button</span>
              <div 
                className={`w-10 h-5 rounded-full p-1 transition-colors duration-200 ease-in-out ${settings.showSelectionButton ? 'bg-indigo-600' : 'bg-gray-300'}`}
                onClick={() => handleSettingChange('showSelectionButton')}
              >
                <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${settings.showSelectionButton ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">Auto-open on selection</span>
              <div 
                className={`w-10 h-5 rounded-full p-1 transition-colors duration-200 ease-in-out ${settings.autoOpenOnSelection ? 'bg-indigo-600' : 'bg-gray-300'}`}
                onClick={() => handleSettingChange('autoOpenOnSelection')}
              >
                <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${settings.autoOpenOnSelection ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">Auto-query on selection</span>
              <div 
                className={`w-10 h-5 rounded-full p-1 transition-colors duration-200 ease-in-out ${settings.autoQueryOnSelection ? 'bg-indigo-600' : 'bg-gray-300'}`}
                onClick={() => handleSettingChange('autoQueryOnSelection')}
              >
                <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${settings.autoQueryOnSelection ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </label>
          </div>
        </div>
      )}
      
      {/* Dropdown menu */}
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="chat-dropdown absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fadeIn"
        >
          <div className="py-1">
            <button 
              onClick={openSettings}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center"
            >
              <Settings size={16} className="mr-2 text-gray-500" />
              Settings
            </button>
            <button 
              onClick={clearChat}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center"
            >
              <Trash2 size={16} className="mr-2 text-gray-500" />
              Clear Chat
            </button>
          </div>
        </div>
      )}
      
      {/* Main chat button with dropdown */}
      <div className="relative">
        <button
          onClick={toggleChat}
          className="main-button bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-3 shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 flex items-center"
          aria-label="Toggle chat"
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <div className="flex items-center">
              <MessageSquare size={24} />
              <div 
                className="ml-1 cursor-pointer p-1 hover:bg-white/10 rounded-full"
                onClick={toggleDropdown}
              >
                <ChevronDown size={16} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </div>
            </div>
          )}
        </button>
      </div>
      
      {/* Chat window */}
      {isOpen && (
        <div 
          ref={chatContainerRef}
          className="absolute bottom-16 right-0 w-80 overflow-clip md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col max-h-[600px] transition-all duration-300 ease-in-out"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          {/* Chat header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium flex items-center">
              <MessageSquare size={18} className="mr-2" />
              Gemini AI Assistant
            </h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={clearChat}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Clear chat"
                title="Clear chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
              <button 
                onClick={toggleChat}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px] bg-gray-50">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn group relative`}
              >
                <div 
                  className={`max-w-[85%] rounded-lg p-3 shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: formatCodeBlocks(message.content)
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/\n\n/g, '<br/><br/>')
                          .replace(/\n/g, '<br/>')
                          .replace(/- (.*?)(<br\/>|$)/g, '<li>$1</li>')
                      }}
                    />
                  ) : (
                    message.content
                  )}
                </div>
                
                {/* Message actions */}
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  {message.role === 'assistant' && (
                    <button 
                      onClick={() => copyToClipboard(message.content)}
                      className="bg-gray-100 hover:bg-gray-200 p-1 rounded-full shadow-sm transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy size={14} className="text-gray-600" />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteMessage(index)}
                    className="bg-gray-100 hover:bg-red-100 p-1 rounded-full shadow-sm transition-colors"
                    title="Delete message"
                  >
                    <Trash2 size={14} className="text-gray-600 hover:text-red-600" />
                  </button>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-white text-gray-800 rounded-lg rounded-bl-none p-3 flex items-center shadow-sm">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input form */}
          <form onSubmit={sendMessage} className="border-t border-gray-200 p-1 flex items-center  bg-white rounded-b-lg">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 border   border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-r-lg transition-all duration-300 ${
                isLoading || !inputValue.trim() 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:from-indigo-700 hover:to-purple-700'
              }`}
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? <Loader2 size={26} className="animate-spin " /> : <Send size={26} />}
            </button>
          </form>
        </div>
      )}

      {/* Add these styles to your global CSS or inline here */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .prose pre {
          margin: 0.8em 0;
          border-radius: 0.375rem;
          background-color: #1f2937;
          color: #000000;
          padding: 0.75rem;
          overflow-x: auto;
        }
        .prose code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.875em;
        }
        .prose strong {
          font-weight: 600;
          color: inherit;
        }
        .prose em {
          font-style: italic;
          color: inherit;
        }
        .prose li {
          margin-left: 1.25rem;
          list-style-type: disc;
        }
      `}</style>
    </div>
  );
}
