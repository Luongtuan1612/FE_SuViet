import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, RotateCcw, Lightbulb } from "lucide-react";
import { getAiResponse, suggestedQuestions } from "../data/aiData";
import { Link } from "react-router";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

function formatMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="list-disc list-inside space-y-1 my-2 text-sm">
          {listItems.map((item, i) => (
            <li key={i} className="text-gray-700">{item}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const flushTable = (key: string) => {
    if (tableRows.length > 0) {
      elements.push(
        <div key={key} className="overflow-x-auto my-3">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr>
                {tableRows[0].map((cell, i) => (
                  <th key={i} className="border border-gray-200 bg-[#F5EDD8] px-3 py-1.5 text-left font-semibold text-[#8B4513]">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(2).map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {row.map((cell, j) => (
                    <td key={j} className="border border-gray-200 px-3 py-1.5 text-gray-700">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, index) => {
    const key = `line-${index}`;

    // Table row
    if (line.startsWith("|")) {
      inTable = true;
      const cols = line.split("|").filter((_, i, arr) => i !== 0 && i !== arr.length - 1).map((c) => c.trim());
      tableRows.push(cols);
      return;
    } else if (inTable) {
      flushTable(key);
    }

    // H2
    if (line.startsWith("## ")) {
      flushList(key);
      elements.push(<h2 key={key} className="font-bold text-[#8B1A1A] mt-3 mb-1" style={{ fontSize: "1rem" }}>{line.slice(3)}</h2>);
      return;
    }
    // H3
    if (line.startsWith("### ")) {
      flushList(key);
      elements.push(<h3 key={key} className="font-semibold text-gray-800 mt-2 mb-1 text-sm">{line.slice(4)}</h3>);
      return;
    }
    // Blockquote
    if (line.startsWith("> ")) {
      flushList(key);
      elements.push(
        <blockquote key={key} className="border-l-3 border-[#DAA520] pl-3 my-2 text-sm text-gray-600 italic">
          {line.slice(2)}
        </blockquote>
      );
      return;
    }
    // List item
    if (line.startsWith("- ") || line.startsWith("* ")) {
      listItems.push(line.slice(2));
      return;
    }
    // Empty line
    if (!line.trim()) {
      flushList(key);
      elements.push(<div key={key} className="h-1" />);
      return;
    }

    // Bold + regular text
    flushList(key);
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-800">{part}</strong> : part
    );
    elements.push(<p key={key} className="text-sm text-gray-700 leading-relaxed">{rendered}</p>);
  });

  flushList("end");
  flushTable("end-table");

  return elements;
}

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Xin chào! Tôi là trợ lý AI chuyên về **Lịch sử Việt Nam**. 🏛️\n\nBạn có thể hỏi tôi về:\n- Các sự kiện lịch sử (Bạch Đằng, Điện Biên Phủ...)\n- Nhân vật lịch sử (Ngô Quyền, Trần Hưng Đạo...)\n- Các triều đại phong kiến Việt Nam\n- Cuộc kháng chiến chống Pháp, chống Mỹ\n\nHãy đặt câu hỏi cho tôi! 👇",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      const aiResponse = getAiResponse(text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome-new",
        role: "ai",
        content: "Cuộc trò chuyện đã được làm mới! Hãy đặt câu hỏi về **Lịch sử Việt Nam** cho tôi. 🏛️",
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
    inputRef.current?.focus();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#8B1A1A] flex items-center gap-2" style={{ fontSize: "1.8rem", fontWeight: 700 }}>
            <Sparkles size={24} className="text-[#DAA520]" />
            Hỏi đáp AI Lịch sử
          </h1>
          <p className="text-gray-600 text-sm mt-1">Trợ lý AI sẵn sàng giải đáp mọi câu hỏi về lịch sử Việt Nam</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-[#8B1A1A] border border-gray-200 rounded-lg hover:border-[#8B1A1A]/30 transition-all"
        >
          <RotateCcw size={14} /> Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col" style={{ height: "600px" }}>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#8B1A1A] to-[#DAA520] rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Trợ lý AI Lịch sử</div>
                <div className="flex items-center gap-1.5 text-xs text-green-600">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Đang hoạt động
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.role === "ai"
                      ? "bg-gradient-to-br from-[#8B1A1A] to-[#DAA520]"
                      : "bg-[#E8E8E8]"
                  }`}>
                    {msg.role === "ai" ? (
                      <Sparkles size={14} className="text-white" />
                    ) : (
                      <User size={14} className="text-gray-600" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-[#8B1A1A] text-white rounded-tr-sm"
                        : "bg-[#FBF7F0] border border-[#DAA520]/20 rounded-tl-sm"
                    }`}>
                      {msg.role === "user" ? (
                        <p className="text-sm text-white">{msg.content}</p>
                      ) : (
                        <div>{formatMarkdown(msg.content)}</div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 px-1">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B1A1A] to-[#DAA520] flex items-center justify-center shrink-0">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div className="bg-[#FBF7F0] border border-[#DAA520]/20 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[#8B1A1A]/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-[#8B1A1A]/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-[#8B1A1A]/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Nhập câu hỏi l���ch sử của bạn..."
                  disabled={isTyping}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 py-2.5 bg-[#8B1A1A] text-white rounded-xl hover:bg-[#6B1414] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-2 text-center">
                AI trả lời dựa trên cơ sở dữ liệu lịch sử Việt Nam
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar: Suggested Questions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
              <Lightbulb size={15} className="text-[#DAA520]" />
              Câu hỏi gợi ý
            </h3>
            <div className="space-y-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={isTyping}
                  className="w-full text-left px-3 py-2 bg-[#FBF7F0] hover:bg-[#F5EDD8] border border-[#DAA520]/20 hover:border-[#DAA520]/40 rounded-lg text-xs text-gray-700 transition-all disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#8B1A1A] to-[#5C1111] rounded-2xl p-4 text-white">
            <h3 className="font-semibold mb-2 text-sm">💡 Mẹo sử dụng</h3>
            <ul className="text-xs text-white/80 space-y-1.5">
              <li>• Hỏi bằng tiếng Việt tự nhiên</li>
              <li>• Đặt câu hỏi cụ thể về sự kiện, năm, nhân vật</li>
              <li>• Có thể hỏi về chiến thuật, diễn biến</li>
              <li>• Tra thêm tại trang{" "}
                <Link to="/su-kien" className="text-[#DAA520] hover:underline">Sự kiện</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
