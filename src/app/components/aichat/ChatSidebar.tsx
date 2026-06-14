import { Link } from "react-router";
import { Lightbulb, MessageSquare, Trash2 } from "lucide-react";
import type { ChatSession } from "../../types/aiChat";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: number | null;
  isLoadingSessions: boolean;
  suggestedQuestions: string[];
  isTyping: boolean;
  onNewChat: () => void;
  onLoadSession: (sessionId: number) => void;
  onSendSuggested: (question: string) => void;
  onDeleteSession: (sessionId: number, title: string) => void;
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  isLoadingSessions,
  suggestedQuestions,
  isTyping,
  onNewChat,
  onLoadSession,
  onSendSuggested,
  onDeleteSession,
}: ChatSidebarProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
            <MessageSquare size={15} className="text-[#DAA520]" />
            Lịch sử trò chuyện
          </h3>

          <button
            type="button"
            onClick={onNewChat}
            className="text-xs text-[#8B1A1A] hover:underline"
          >
            Chat mới
          </button>
        </div>

        {isLoadingSessions ? (
          <p className="text-xs text-gray-400">Đang tải lịch sử...</p>
        ) : sessions.length === 0 ? (
          <p className="text-xs text-gray-400">
            Chưa có lịch sử trò chuyện hoặc bạn chưa đăng nhập.
          </p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all border ${
                  activeSessionId === session.id
                    ? "bg-[#F5EDD8] border-[#DAA520]/50 text-[#8B1A1A]"
                    : "bg-white hover:bg-[#FBF7F0] border-gray-100 text-gray-700"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onLoadSession(session.id)}
                  className="flex-1 text-left"
                >
                  <div className="line-clamp-2">
                    {session.title || "Cuộc trò chuyện mới"}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDeleteSession(
                      session.id,
                      session.title || "Cuộc trò chuyện mới",
                    )
                  }
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
          {suggestedQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => onSendSuggested(question)}
              disabled={isTyping}
              className="w-full text-left px-3 py-2 bg-[#FBF7F0] hover:bg-[#F5EDD8] border border-[#DAA520]/20 hover:border-[#DAA520]/40 rounded-lg text-xs text-gray-700 transition-all disabled:opacity-50"
            >
              {question}
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
  );
}