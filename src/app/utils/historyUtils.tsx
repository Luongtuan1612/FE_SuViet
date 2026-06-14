import type { HistoryFigure } from "../../services/historyService";

export const getFigureRole = (figure: HistoryFigure & { role?: string }) => {
  return (
    figure.role ||
    figure.bornDied ||
    figure.description ||
    "Nhân vật lịch sử liên quan"
  );
};

export const formatEventContent = (content: string) => {
  return content
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para, i) => {
      const formatted = para
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(
          /^Ý nghĩa lịch sử:\s*/i,
          "<strong>Ý nghĩa lịch sử:</strong><br />"
        );

      return (
        <p
          key={i}
          className="text-gray-700 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
};
