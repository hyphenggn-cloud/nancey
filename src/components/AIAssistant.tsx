import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  Sparkles,
  Truck,
  RotateCcw,
  Minimize2,
  Maximize2,
  Globe,
  ExternalLink,
  Zap,
  Cpu
} from 'lucide-react';
import { processLogisticsQuery, ChatMessage, QueryOptions } from '../services/logisticsAiService';

interface AIAssistantProps {
  onNavigateToQuote: () => void;
  onNavigateToTrack: (trackingId?: string) => void;
  onNavigateToFleet: () => void;
  onNavigateToServices: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  onNavigateToQuote,
  onNavigateToTrack,
  onNavigateToFleet,
  onNavigateToServices,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [enableSearch, setEnableSearch] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Hello! I am the **Outshipper Logistics & Freight Advisor**.\n\nPowered by Google Gemini with live Indian freight intelligence. I can assist you with:\n• Finding the exact commercial truck class for your weight & cubic volume\n• Live route intelligence (Delhi-Mumbai expressway conditions, highway weather, FASTag regulations)\n• Consignment milestone verification (e.g., test with **NL123456789**)\n• Structuring multi-lane commercial transportation contracts\n\nWhat freight challenge can I assist with today?',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    'What truck is needed for 12 tonnes from Gurgaon to Mumbai?',
    'Current FASTag rules and E-Way bill penalty guidelines?',
    'Track active consignment NL123456789',
    'Compare FTL and PTL cost structure for 3 tonnes',
  ];

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const options: QueryOptions = {
        model: selectedModel,
        enableSearch,
      };

      const assistantReply = await processLogisticsQuery(query, messages, options);
      setMessages((prev) => [...prev, assistantReply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          text: 'I am currently unable to complete this query. For immediate dispatch coordination, please call our dispatch team at +91 92123 99003.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCtaAction = (action: string) => {
    if (action === 'nav:quote') {
      onNavigateToQuote();
      setIsOpen(false);
    } else if (action === 'nav:fleet') {
      onNavigateToFleet();
      setIsOpen(false);
    } else if (action === 'nav:services') {
      onNavigateToServices();
      setIsOpen(false);
    } else if (action.startsWith('track:')) {
      const id = action.split(':')[1];
      onNavigateToTrack(id);
      setIsOpen(false);
    }
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1 text-xs leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          const parts = line.split(/(\*\*.*?\*\*)/g);
          const renderedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (line.startsWith('• ') || line.startsWith('- ')) {
            return (
              <div key={idx} className="pl-3 relative">
                <span className="absolute left-0 text-orange-500 font-bold">•</span>
                <span>{renderedLine}</span>
              </div>
            );
          }

          return <p key={idx}>{renderedLine}</p>;
        })}
      </div>
    );
  };

  return (
    <div
      className={`fixed right-4 sm:right-5 transition-all duration-200 ${
        isOpen
          ? 'bottom-4 sm:bottom-5 z-50'
          : 'bottom-20 sm:bottom-22 z-40'
      }`}
    >
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-slate-900 hover:bg-[#E60023] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-200 cursor-pointer active:scale-95 border border-slate-700"
          aria-label="Open Outshipper AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-red-400 group-hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold leading-tight flex items-center gap-1">
              Outshipper AI
              <Sparkles className="w-3 h-3 text-red-400" />
            </span>
            <span className="text-[10px] text-slate-300 font-medium">
              Gemini + Google Search Grounding
            </span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`w-[94vw] sm:w-[440px] bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden transition-all duration-200 ${
            isMinimized ? 'h-16' : 'h-[620px] max-h-[88vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E60023] text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold font-display flex items-center gap-1.5 text-white">
                  Outshipper AI Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </h3>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>Gemini Chat</span>
                  {selectedModel === 'gemini-3.5-flash' && enableSearch && (
                    <span className="text-orange-400 font-medium flex items-center gap-0.5">
                      · <Globe className="w-2.5 h-2.5" /> Search Grounded
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setMessages([{
                  id: 'welcome-reset',
                  sender: 'assistant',
                  text: 'Conversation reset. How can I assist with your freight dispatch today?',
                  timestamp: 'Just now'
                }])}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Model & Search Grounding Controls Bar */}
              <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
                {/* Model Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-medium">Model:</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as any)}
                    className="bg-slate-800 text-slate-200 text-[11px] font-semibold py-1 px-2 rounded border border-slate-700 focus:outline-none focus:border-orange-500"
                  >
                    <option value="gemini-3.5-flash">gemini-3.5-flash (General + Search)</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
                    <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex)</option>
                  </select>
                </div>

                {/* Google Search Grounding toggle (for 3.5-flash) */}
                {selectedModel === 'gemini-3.5-flash' && (
                  <button
                    onClick={() => setEnableSearch(!enableSearch)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                      enableSearch
                        ? 'bg-orange-950 text-orange-400 border border-orange-800/80'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                    title="Toggle Google Search Grounding"
                  >
                    <Globe className="w-3 h-3" />
                    <span>Search: {enableSearch ? 'ON' : 'OFF'}</span>
                  </button>
                )}
              </div>

              {/* Message List (Scrollable Thread) */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/70">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-xl p-3 shadow-2xs ${
                        msg.sender === 'user'
                          ? 'bg-orange-600 text-white rounded-tr-none text-xs font-medium'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.sender === 'user' ? (
                        <p>{msg.text}</p>
                      ) : (
                        <div>
                          {renderFormattedText(msg.text)}

                          {/* Grounding Sources (Google Search Grounding) */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <Globe className="w-3 h-3 text-orange-600" />
                                <span>Grounding Sources (Google Search)</span>
                              </span>
                              <div className="flex flex-col gap-1">
                                {msg.sources.slice(0, 3).map((source, sIdx) => (
                                  <a
                                    key={sIdx}
                                    href={source.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 truncate"
                                  >
                                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                    <span className="truncate">{source.title || source.uri}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action CTA Button */}
                          {msg.actionCta && (
                            <button
                              onClick={() => handleCtaAction(msg.actionCta!.action)}
                              className="mt-3 w-full py-2 px-3 bg-slate-900 hover:bg-orange-600 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <span>{msg.actionCta.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[9px] mt-1.5">
                        <span className="text-slate-400 font-mono">
                          {msg.modelUsed || ''}
                        </span>
                        <span
                          className={`${
                            msg.sender === 'user' ? 'text-orange-200' : 'text-slate-400'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-orange-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2.5 items-center text-xs text-slate-500">
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-orange-400 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] text-slate-500 ml-1">
                        {enableSearch && selectedModel === 'gemini-3.5-flash'
                          ? 'Searching web & reasoning...'
                          : 'Processing logistics requirement...'}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Query Chips */}
              <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 overflow-x-auto whitespace-nowrap flex gap-1.5 no-scrollbar">
                {quickChips.map((chip, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(chip)}
                    className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-medium transition-colors cursor-pointer shrink-0"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about trucks, routes, FASTag, tracking..."
                    className="flex-1 p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 font-medium text-slate-900"
                  />

                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="text-[10px] text-slate-400 text-center mt-1.5">
                  Multi-turn conversation · Up-to-date with Google Search grounding
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
