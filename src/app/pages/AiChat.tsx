import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  CHAT_API_BASE_URL,
  NEW_CHAT_MESSAGE,
  SUGGESTED_QUESTIONS,
  WELCOME_MESSAGE,
} from "../constants/aiChatConstants";
import type {
  ChatApiResponse,
  ChatMessageFromApi,
  ChatSession,
  FeedbackRating,
  Message,
} from "../types/aiChat";
import { getAuthToken, parseSources } from "../utils/aiChatUtils";
import { AiChatHeader } from "../components/aichat/AiChatHeader";
import { ChatPanel } from "../components/aichat/ChatPanel";
import { ChatSidebar } from "../components/aichat/ChatSidebar";
import { DeleteSessionDialog } from "../components/aichat/DeleteSessionDialog";

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
      content: WELCOME_MESSAGE,
      timestamp: new Date(),
      sources: [],
    },
  ]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

      const response = await fetch(`${CHAT_API_BASE_URL}/sessions`, {
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
        `${CHAT_API_BASE_URL}/sessions/${selectedSessionId}/messages`,
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

    const response = await fetch(CHAT_API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sessionId,
        question,
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
    rating: FeedbackRating,
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
      const response = await fetch(`${CHAT_API_BASE_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messageId,
          rating,
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

  const handleReset = () => {
    setSessionId(null);
    setMessages([
      {
        id: "welcome-new",
        role: "ai",
        content: NEW_CHAT_MESSAGE,
        timestamp: new Date(),
        sources: [],
      },
    ]);
    setInputValue("");
    inputRef.current?.focus();
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

    if (!deleteSessionId) return;

    try {
      setIsDeleting(true);

      const response = await fetch(
        `${CHAT_API_BASE_URL}/sessions/${deleteSessionId}`,
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

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    fetchChatSessions();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <AiChatHeader onReset={handleReset} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <ChatPanel
          messages={messages}
          isTyping={isTyping}
          inputValue={inputValue}
          messagesContainerRef={messagesContainerRef}
          inputRef={inputRef}
          onInputChange={setInputValue}
          onSubmit={handleSubmit}
          onFeedback={submitFeedback}
        />

        <ChatSidebar
          sessions={chatSessions}
          activeSessionId={sessionId}
          isLoadingSessions={isLoadingSessions}
          suggestedQuestions={SUGGESTED_QUESTIONS}
          isTyping={isTyping}
          onNewChat={handleReset}
          onLoadSession={loadMessagesBySession}
          onSendSuggested={sendMessage}
          onDeleteSession={openDeleteModal}
        />
      </div>

      <DeleteSessionDialog
        open={deleteSessionId !== null}
        sessionTitle={deleteSessionTitle}
        isDeleting={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteChatSession}
      />
    </div>
  );
}