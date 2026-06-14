interface EventSummaryBoxProps {
  summary?: string;
}

export function EventSummaryBox({ summary }: EventSummaryBoxProps) {
  return (
    <div className="bg-[#F5EDD8] border border-[#DAA520]/30 rounded-xl p-4 mb-6">
      <p className="text-[#5C3A1E] text-sm leading-relaxed italic whitespace-pre-line">
        📜 <strong>Tóm tắt:</strong>{" "}
        {summary || "Chưa có tóm tắt cho sự kiện này."}
      </p>
    </div>
  );
}
