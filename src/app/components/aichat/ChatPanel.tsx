import type { FormEvent, RefObject } from "react";
import {
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";
import type { FeedbackRating, Message } from "../../types/aiChat";
import {
  formatMarkdown,
  formatTime,
  isWelcomeMessage,
} from "../../utils/aiChatUtils";

interface ChatPanelProps {
  messages: Message[];
  isTyping: boolean;
  inputValue: string;
  messagesContainerRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onFeedback: (
    messageId: number | undefined,
    rating: FeedbackRating,
  ) => void;
}

export function ChatPanel({
  messages,
  isTyping,
  inputValue,
  messagesContainerRef,
  inputRef,
  onInputChange,
  onSubmit,
  onFeedback,
}: ChatPanelProps) {
  return (
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
                            type="button"
                            onClick={() => onFeedback(msg.messageId, "LIKE")}
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
                            type="button"
                            onClick={() => onFeedback(msg.messageId, "DISLIKE")}
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
          <form onSubmit={onSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
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
  );
}