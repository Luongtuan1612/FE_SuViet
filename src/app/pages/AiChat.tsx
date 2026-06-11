import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Send,
  Sparkles,
  User,
  RotateCcw,
  Lightbulb,
  MessageSquare,
  Trash2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Link } from "react-router";

interface Source {
  title?: string;
  source?: string;
  period?: string;
  url?: string;
  fileName?: string;
  file_name?: string;
  chunkIndex?: number;
  chunk_index?: number;
}

interface Message {
  id: string;
  messageId?: number;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  sources?: Source[];
  feedback?: "LIKE" | "DISLIKE";
}

interface ChatApiResponse {
  sessionId: number;
  aiMessageId?: number;
  answer: string;
  sources: Source[];
}

interface ChatSession {
  id: number;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ChatMessageFromApi {
  id: number;
  sender: "USER" | "AI";
  message: string;
  sources?: string | null;
  createdAt?: string;
}

const API_BASE_URL = "http://localhost:8080/api/v1/chat";

const suggestedQuestions = [
  "Việt Nam thời tiền sử có đặc điểm gì?",
  "Thời dựng nước đầu tiên ở Việt Nam có đặc điểm gì?",
  "Triều Ngô - Đinh - Tiền Lê diễn ra trong giai đoạn nào?",
  "Triều Lý - Trần có những đặc điểm nổi bật gì?",
  "Triều Nguyễn tồn tại trong giai đoạn nào?",
  "Cuộc kháng chiến chống thực dân Pháp 1946-1954 có ý nghĩa gì?",
];
function isNoDataAnswer(text: string) {
  const normalized = text.toLowerCase();

  return (
    normalized.includes("chưa có đủ dữ liệu") ||
    normalized.includes("không có đủ dữ liệu") ||
    normalized.includes("chưa có dữ liệu") ||
    normalized.includes("không tìm thấy dữ liệu") ||
    normalized.includes("không thể trả lời chính xác")
  );
}

function getAuthToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("authToken")
  );
}

function parseSources(sources?: string | null): Source[] {
  if (!sources) return [];

  try {
    const parsed = JSON.parse(sources);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getSourceLogoInfo(source?: Source) {
  const sourceName = (source?.source || "").toLowerCase();
  const title = source?.title || "Nguồn tham khảo";
  const url = source?.url;

  if (
    sourceName.includes("bảo tàng") ||
    sourceName.includes("lịch sử") ||
    sourceName.includes("lich su") ||
    title.toLowerCase().includes("bảo tàng")
  ) {
    return {
      label: source?.source || "Bảo tàng Lịch sử Quốc gia",
      logo: "🏛️",
      url: url || "https://baotanglichsu.vn/vi",
    };
  }

  if (sourceName.includes("thư viện") || sourceName.includes("nlv")) {
    return {
      label: source?.source || "Thư viện Quốc gia Việt Nam",
      logo: "📚",
      url: url || "https://nlv.gov.vn",
    };
  }

  if (sourceName.includes("hồ chí minh") || sourceName.includes("hochiminh")) {
    return {
      label: source?.source || "Trang thông tin Hồ Chí Minh",
      logo: "⭐",
      url: url || "https://hochiminh.vn",
    };
  }

  if (sourceName.includes("bộ giáo dục") || sourceName.includes("moet")) {
    return {
      label: source?.source || "Bộ Giáo dục và Đào tạo",
      logo: "🎓",
      url: url || "https://moet.gov.vn",
    };
  }

  return {
    label: source?.source || "Nguồn tham khảo",
    logo: "🔎",
    url: url || "#",
  };
}

function getUniqueSources(sources?: Source[]) {
  if (!sources || sources.length === 0) return [];

  const seen = new Set<string>();

  return sources.filter((source) => {
    const info = getSourceLogoInfo(source);
    const key = `${info.label}-${info.url}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function InlineSourceLogos({ sources }: { sources?: Source[] }) {
  const uniqueSources = getUniqueSources(sources);

  if (uniqueSources.length === 0) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1 ml-2 align-middle">
      {uniqueSources.map((source, index) => {
        const info = getSourceLogoInfo(source);
        const tooltip = `${info.label}${source.title ? ` - ${source.title}` : ""}`;

        return (
          <a
            key={`${info.label}-${index}`}
            href={info.url}
            target="_blank"
            rel="noreferrer"
            title={tooltip}
            onClick={(e) => {
              if (!info.url || info.url === "#") {
                e.preventDefault();
              }
            }}
            className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-white border border-[#DAA520]/40 text-sm shadow-sm hover:scale-110 hover:border-[#8B1A1A]/50 transition-all"
          >
            {info.logo}
          </a>
        );
      })}
    </span>
  );
}

function formatMarkdown(text: string, sources?: Source[]) {
  const shouldShowSources = !isNoDataAnswer(text);
  const displaySources = shouldShowSources ? sources : [];
  const lines = text.split("\n");
  const elements: ReactNode[] = [];
  let listItems: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const lastNonEmptyLineIndex = (() => {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].trim()) return i;
    }
    return -1;
  })();

  const flushList = (key: string, shouldAppendSources = false) => {
    if (listItems.length > 0) {
      elements.push(
        <div key={key} className="my-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            {listItems.map((item, i) => (
              <li key={i} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>

          {shouldAppendSources && (
            <div className="mt-1">
              <InlineSourceLogos sources={displaySources} />
            </div>
          )}
        </div>,
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
                  <th
                    key={i}
                    className="border border-gray-200 bg-[#F5EDD8] px-3 py-1.5 text-left font-semibold text-[#8B4513]"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tableRows.slice(2).map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="border border-gray-200 px-3 py-1.5 text-gray-700"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );

      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, index) => {
    const key = `line-${index}`;
    const isLastTextLine = index === lastNonEmptyLineIndex;

    if (line.startsWith("|")) {
      inTable = true;
      const cols = line
        .split("|")
        .filter((_, i, arr) => i !== 0 && i !== arr.length - 1)
        .map((c) => c.trim());

      tableRows.push(cols);
      return;
    } else if (inTable) {
      flushTable(key);
    }

    if (line.startsWith("## ")) {
      flushList(key);
      elements.push(
        <h2
          key={key}
          className="font-bold text-[#8B1A1A] mt-3 mb-1"
          style={{ fontSize: "1rem" }}
        >
          {line.slice(3)}
          {isLastTextLine && <InlineSourceLogos sources={displaySources} />}
        </h2>,
      );
      return;
    }

    if (line.startsWith("### ")) {
      flushList(key);
      elements.push(
        <h3 key={key} className="font-semibold text-gray-800 mt-2 mb-1 text-sm">
          {line.slice(4)}
          {isLastTextLine && <InlineSourceLogos sources={displaySources} />}
        </h3>,
      );
      return;
    }

    if (line.startsWith("> ")) {
      flushList(key);
      elements.push(
        <blockquote
          key={key}
          className="border-l-3 border-[#DAA520] pl-3 my-2 text-sm text-gray-600 italic"
        >
          {line.slice(2)}
          {isLastTextLine && <InlineSourceLogos sources={displaySources} />}
        </blockquote>,
      );
      return;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      listItems.push(line.slice(2));

      if (isLastTextLine) {
        flushList(key, true);
      }

      return;
    }

    if (!line.trim()) {
      flushList(key);
      elements.push(<div key={key} className="h-1" />);
      return;
    }

    flushList(key);

    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="font-semibold text-gray-800">
          {part}
        </strong>
      ) : (
        part
      ),
    );

    elements.push(
      <p key={key} className="text-sm text-gray-700 leading-relaxed">
        {rendered}
        {isLastTextLine && <InlineSourceLogos sources={displaySources} />}
      </p>,
    );
  });

  flushList("end");
  flushTable("end-table");

  return elements;
}

export function AiChat() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState<number | null>(null);
  const [deleteSessionTitle, setDeleteSessionTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Xin chào! Tôi là trợ lý AI chuyên về **Lịch sử Việt Nam**. 🏛️\n\nBạn cần đăng nhập để sử dụng chatbot và lưu lịch sử trò chuyện.\n\nBạn có thể hỏi tôi về:\n- Các thời kỳ lịch sử Việt Nam\n- Các triều đại phong kiến\n- Các cuộc kháng chiến chống ngoại xâm\n- Nhân vật và sự kiện lịch sử\n\nHãy đặt câu hỏi cho tôi! 👇",
      timestamp: new Date(),
      sources: [],
    },
  ]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    fetchChatSessions();
  }, []);

  const addSystemMessage = (content: string) => {
    const systemMsg: Message = {
      id: Date.now().toString(),
      role: "ai",
      content,
      timestamp: new Date(),
      sources: [],
    };

    setMessages((prev) => [...prev, systemMsg]);
  };

  const fetchChatSessions = async () => {
    const token = getAuthToken();

    if (!token) {
      setChatSessions([]);
      return;
    }

    try {
      setIsLoadingSessions(true);

      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Không lấy được lịch sử chat:", response.status);
        setChatSessions([]);
        return;
      }

      const data: ChatSession[] = await response.json();
      setChatSessions(data || []);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử chat:", error);
      setChatSessions([]);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadMessagesBySession = async (selectedSessionId: number) => {
    const token = getAuthToken();

    if (!token) {
      addSystemMessage("Bạn cần đăng nhập để xem lịch sử trò chuyện.");
      return;
    }

    try {
      setIsTyping(true);

      const response = await fetch(
        `${API_BASE_URL}/sessions/${selectedSessionId}/messages`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Không lấy được tin nhắn của cuộc trò chuyện này.");
      }

      const data: ChatMessageFromApi[] = await response.json();

      const mappedMessages: Message[] = data.map((item) => ({
        id: item.id.toString(),
        messageId: item.id,
        role: item.sender === "USER" ? "user" : "ai",
        content: item.message,
        timestamp: item.createdAt ? new Date(item.createdAt) : new Date(),
        sources: item.sender === "AI" ? parseSources(item.sources) : [],
      }));

      setSessionId(selectedSessionId);

      if (mappedMessages.length > 0) {
        setMessages(mappedMessages);
      } else {
        setMessages([
          {
            id: "empty-session",
            role: "ai",
            content: "Cuộc trò chuyện này chưa có tin nhắn nào.",
            timestamp: new Date(),
            sources: [],
          },
        ]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
      addSystemMessage(
        error instanceof Error ? error.message : "Có lỗi khi tải lịch sử chat.",
      );
    } finally {
      setIsTyping(false);
    }
  };

  const callChatApi = async (question: string): Promise<ChatApiResponse> => {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Bạn cần đăng nhập để sử dụng chatbot AI.");
    }

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sessionId: sessionId,
        question: question,
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Phiên đăng nhập đã hết hạn hoặc bạn chưa đăng nhập.");
      }

      throw new Error(`Lỗi API: ${response.status}`);
    }

    return response.json();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userQuestion = text.trim();

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userQuestion,
      timestamp: new Date(),
      sources: [],
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const data = await callChatApi(userQuestion);

      setSessionId(data.sessionId);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        messageId: data.aiMessageId,
        role: "ai",
        content: data.answer || "AI chưa trả về câu trả lời.",
        timestamp: new Date(),
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, aiMsg]);

      await fetchChatSessions();
    } catch (error) {
      console.error("Lỗi khi gọi chatbot:", error);

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi gọi chatbot AI.",
        timestamp: new Date(),
        sources: [],
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const submitFeedback = async (
    messageId: number | undefined,
    rating: "LIKE" | "DISLIKE",
  ) => {
    const token = getAuthToken();

    if (!token) {
      addSystemMessage("Bạn cần đăng nhập để đánh giá câu trả lời.");
      return;
    }

    if (!messageId) {
      addSystemMessage("Không tìm thấy ID câu trả lời để đánh giá.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messageId: messageId,
          rating: rating,
          comment: "",
        }),
      });

      if (!response.ok) {
        throw new Error("Không gửi được đánh giá.");
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId
            ? {
                ...msg,
                feedback: rating,
              }
            : msg,
        ),
      );

      addSystemMessage("Cảm ơn bạn! Hệ thống đã ghi nhận đánh giá.");
    } catch (error) {
      console.error("Lỗi khi gửi feedback:", error);
      addSystemMessage(
        error instanceof Error ? error.message : "Có lỗi khi gửi đánh giá.",
      );
    }
  };

  const openDeleteModal = (targetSessionId: number, title: string) => {
    setDeleteSessionId(targetSessionId);
    setDeleteSessionTitle(title || "Cuộc trò chuyện này");
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setDeleteSessionId(null);
    setDeleteSessionTitle("");
  };

  const confirmDeleteChatSession = async () => {
    const token = getAuthToken();

    if (!token) {
      addSystemMessage("Bạn cần đăng nhập để xóa lịch sử chat.");
      closeDeleteModal();
      return;
    }

    if (!deleteSessionId) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(
        `${API_BASE_URL}/sessions/${deleteSessionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Không xóa được cuộc trò chuyện.");
      }

      if (sessionId === deleteSessionId) {
        handleReset();
      }

      await fetchChatSessions();

      setDeleteSessionId(null);
      setDeleteSessionTitle("");
    } catch (error) {
      console.error("Lỗi khi xóa lịch sử chat:", error);
      addSystemMessage(
        error instanceof Error ? error.message : "Có lỗi khi xóa lịch sử chat.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleReset = () => {
    setSessionId(null);
    setMessages([
      {
        id: "welcome-new",
        role: "ai",
        content:
          "Cuộc trò chuyện mới đã được tạo. Hãy đặt câu hỏi về **Lịch sử Việt Nam** cho tôi. 🏛️",
        timestamp: new Date(),
        sources: [],
      },
    ]);
    setInputValue("");
    inputRef.current?.focus();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isWelcomeMessage = (msg: Message) => {
    return (
      msg.id === "welcome" ||
      msg.id === "welcome-new" ||
      msg.id === "empty-session"
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-[#8B1A1A] flex items-center gap-2"
            style={{ fontSize: "1.8rem", fontWeight: 700 }}
          >
            <Sparkles size={24} className="text-[#DAA520]" />
            Hỏi đáp AI Lịch sử
          </h1>

          <p className="text-gray-600 text-sm mt-1">
            Trợ lý AI trả lời dựa trên kho dữ liệu lịch sử Việt Nam đã được nạp
            vào hệ thống
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-[#8B1A1A] border border-gray-200 rounded-lg hover:border-[#8B1A1A]/30 transition-all"
        >
          <RotateCcw size={14} /> Chat mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3">
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col"
            style={{ height: "650px" }}
          >
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#8B1A1A] to-[#DAA520] rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>

              <div>
                <div className="font-semibold text-gray-800 text-sm">
                  Trợ lý AI Lịch sử
                </div>

                <div className="flex items-center gap-1.5 text-xs text-green-600">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Đang hoạt động
                </div>
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      msg.role === "ai"
                        ? "bg-gradient-to-br from-[#8B1A1A] to-[#DAA520]"
                        : "bg-[#E8E8E8]"
                    }`}
                  >
                    {msg.role === "ai" ? (
                      <Sparkles size={14} className="text-white" />
                    ) : (
                      <User size={14} className="text-gray-600" />
                    )}
                  </div>

                  <div
                    className={`max-w-[80%] ${
                      msg.role === "user" ? "items-end" : "items-start"
                    } flex flex-col gap-1`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-[#8B1A1A] text-white rounded-tr-sm"
                          : "bg-[#FBF7F0] border border-[#DAA520]/20 rounded-tl-sm"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="text-sm text-white">{msg.content}</p>
                      ) : (
                        <div>
                          {formatMarkdown(msg.content, msg.sources)}

                          {msg.role === "ai" && !isWelcomeMessage(msg) && (
                            <div className="mt-3 pt-3 border-t border-[#DAA520]/20 flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                Đánh giá:
                              </span>

                              <button
                                onClick={() =>
                                  submitFeedback(msg.messageId, "LIKE")
                                }
                                className={`text-xs px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                                  msg.feedback === "LIKE"
                                    ? "bg-green-50 border-green-400 text-green-700"
                                    : "bg-white border-gray-200 hover:border-green-400 hover:text-green-600"
                                }`}
                              >
                                <ThumbsUp size={12} />
                                Hữu ích
                              </button>

                              <button
                                onClick={() =>
                                  submitFeedback(msg.messageId, "DISLIKE")
                                }
                                className={`text-xs px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                                  msg.feedback === "DISLIKE"
                                    ? "bg-red-50 border-red-400 text-red-700"
                                    : "bg-white border-gray-200 hover:border-red-400 hover:text-red-600"
                                }`}
                              >
                                <ThumbsDown size={12} />
                                Chưa đúng
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <span className="text-xs text-gray-400 px-1">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B1A1A] to-[#DAA520] flex items-center justify-center shrink-0">
                    <Sparkles size={14} className="text-white" />
                  </div>

                  <div className="bg-[#FBF7F0] border border-[#DAA520]/20 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 bg-[#8B1A1A]/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-[#8B1A1A]/60 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-[#8B1A1A]/60 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Nhập câu hỏi lịch sử của bạn..."
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
                AI trả lời dựa trên dữ liệu RAG và nguồn lịch sử đã nạp vào hệ
                thống
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                <MessageSquare size={15} className="text-[#DAA520]" />
                Lịch sử trò chuyện
              </h3>

              <button
                onClick={handleReset}
                className="text-xs text-[#8B1A1A] hover:underline"
              >
                Chat mới
              </button>
            </div>

            {isLoadingSessions ? (
              <p className="text-xs text-gray-400">Đang tải lịch sử...</p>
            ) : chatSessions.length === 0 ? (
              <p className="text-xs text-gray-400">
                Chưa có lịch sử trò chuyện hoặc bạn chưa đăng nhập.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all border ${
                      sessionId === session.id
                        ? "bg-[#F5EDD8] border-[#DAA520]/50 text-[#8B1A1A]"
                        : "bg-white hover:bg-[#FBF7F0] border-gray-100 text-gray-700"
                    }`}
                  >
                    <button
                      onClick={() => loadMessagesBySession(session.id)}
                      className="flex-1 text-left"
                    >
                      <div className="line-clamp-2">
                        {session.title || "Cuộc trò chuyện mới"}
                      </div>
                    </button>

                    <button
                      onClick={() => openDeleteModal(session.id, session.title)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Xóa cuộc trò chuyện"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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
              <li>• Đăng nhập để lưu lịch sử chat</li>
              <li>• Hỏi bằng tiếng Việt tự nhiên</li>
              <li>• Đặt câu hỏi cụ thể về sự kiện, năm, nhân vật</li>
              <li>• Có thể hỏi về bối cảnh, diễn biến, kết quả, ý nghĩa</li>
              <li>
                • Tra thêm tại trang{" "}
                <Link to="/su-kien" className="text-[#DAA520] hover:underline">
                  Sự kiện
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {deleteSessionId && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#8B1A1A]">
              Xóa cuộc trò chuyện?
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Hành động này sẽ xóa toàn bộ câu hỏi và câu trả lời trong cuộc trò chuyện này.
            </p>
          </div>

          <div className="p-5">
            <div className="bg-[#FBF7F0] border border-[#DAA520]/20 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Cuộc trò chuyện</p>
              <p className="text-sm font-medium text-gray-800 line-clamp-2">
                {deleteSessionTitle}
              </p>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              Bạn có chắc chắn muốn xóa lịch sử cuộc trò chuyện này không?
            </p>
          </div>

          <div className="p-5 pt-0 flex items-center justify-end gap-3">
            <button
              onClick={closeDeleteModal}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>

            <button
              onClick={confirmDeleteChatSession}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Trash2 size={14} />
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
