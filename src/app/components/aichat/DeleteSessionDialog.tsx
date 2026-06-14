import { Trash2 } from "lucide-react";

interface DeleteSessionDialogProps {
  open: boolean;
  sessionTitle: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteSessionDialog({
  open,
  sessionTitle,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteSessionDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#8B1A1A]">
            Xóa cuộc trò chuyện?
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Hành động này sẽ xóa toàn bộ câu hỏi và câu trả lời trong cuộc trò
            chuyện này.
          </p>
        </div>

        <div className="p-5">
          <div className="bg-[#FBF7F0] border border-[#DAA520]/20 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Cuộc trò chuyện</p>

            <p className="text-sm font-medium text-gray-800 line-clamp-2">
              {sessionTitle}
            </p>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Bạn có chắc chắn muốn xóa lịch sử cuộc trò chuyện này không?
          </p>
        </div>

        <div className="p-5 pt-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 size={14} />
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}