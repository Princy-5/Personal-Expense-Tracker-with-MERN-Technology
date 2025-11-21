import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const ChatbotModal = ({ isOpen, onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setInput("");

    try {
      console.log("📤 Sending message:", input);
      
      const res = await axiosInstance.post(API_PATHS.CHATBOT.CHAT, { 
        message: input 
      });

      console.log("📥 Received response");
      
      let botText;
      if (res.data.reply) {
        botText = res.data.reply;
      } else if (res.data.error) {
        botText = `⚠️ ${res.data.error}`;
      } else {
        botText = "Sorry, I didn't get a proper response. Please try again.";
      }

      const botMsg = { sender: "bot", text: botText };
      setMessages((prev) => [...prev, botMsg]);
      
    } catch (error) {
      console.error("❌ Chatbot error:", error);
      
      let errorText = "Sorry, I'm having trouble connecting right now. ";
      
      if (error.response?.data?.error) {
        errorText = `🔧 ${error.response.data.error}`;
      } else if (error.code === "ECONNABORTED") {
        errorText = "⏰ Request timeout. Please try again.";
      } else if (!error.response) {
        errorText = "🌐 Network error. Please check your connection.";
      }
      
      const errorMsg = { 
        sender: "bot", 
        text: errorText
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Format long text with better readability
  const formatMessage = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Format bullet points and numbered lists
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        return (
          <div key={index} className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>{line.replace(/^[*\-]\s+/, '')}</span>
          </div>
        );
      }
      
      if (/^\d+\./.test(line.trim())) {
        return (
          <div key={index} className="flex items-start gap-2">
            <span className="text-blue-500 font-medium min-w-4">{line.match(/^\d+/)[0]}.</span>
            <span>{line.replace(/^\d+\.\s+/, '')}</span>
          </div>
        );
      }
      
      // Format bold text (text between **)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        // Add text before the bold
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        // Add bold text
        parts.push(<strong key={match.index} className="font-semibold text-gray-900">{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }
      
      return parts.length > 0 ? <div key={index}>{parts}</div> : <div key={index}>{line}</div>;
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">AI Learning Assistant</h2>
              <p className="text-sm text-gray-600">Ask me anything about programming!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors bg-white"
                title="Clear conversation"
              >
                Clear Chat
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              ×
            </button>
          </div>
        </div>
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">Hello! I'm Your AI Tutor</h3>
              <p className="text-lg mb-4">I can help you learn programming, explain concepts, and guide your learning journey.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-left max-w-md mx-auto">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="font-semibold text-blue-600">💻 Programming</span>
                  <p>MERN Stack, Python, JavaScript, etc.</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="font-semibold text-green-600">📚 Learning</span>
                  <p>Step-by-step guides & resources</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="font-semibold text-purple-600">🔧 Technical</span>
                  <p>Code explanations & best practices</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="font-semibold text-orange-600">🎯 Projects</span>
                  <p>Project ideas & implementation help</p>
                </div>
              </div>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] lg:max-w-[75%] px-4 py-3 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none shadow-lg' 
                  : 'bg-white text-gray-800 rounded-bl-none shadow-lg border border-gray-200'
              }`}>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {formatMessage(msg.text)}
                </div>
                <div className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {msg.sender === 'user' ? 'You' : 'AI Tutor'}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm font-medium">Thinking deeply about your question...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about MERN stack, programming concepts, or anything else..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={loading}
            />
            <button 
              onClick={sendMessage} 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg disabled:shadow-none"
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            💡 Tip: Ask specific questions for detailed explanations
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;