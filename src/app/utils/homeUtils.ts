import type { HistoryEvent, HistoryFigure } from "../../services/historyService";

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Không thể tải dữ liệu trang chủ.";
}

export function formatYearPart(value: string, isRange = false) {
  const num = Number(value.trim());

  if (!Number.isFinite(num)) {
    return value.trim();
  }

  if (num < 0) {
    return `${Math.abs(num)} trước Công nguyên`;
  }

  return isRange ? `${num}` : `năm ${num}`;
}

export function formatYearDisplay(year?: string) {
  const rawYear = year?.trim();

  if (!rawYear) {
    return "Không rõ thời gian";
  }

  const rangeMatch = rawYear.match(/^(-?\d+)\s*(?:-|–|—|đến)\s*(-?\d+)$/i);

  if (rangeMatch) {
    return `${formatYearPart(rangeMatch[1], true)} - ${formatYearPart(
      rangeMatch[2],
      true,
    )}`;
  }

  if (/^-?\d+$/.test(rawYear)) {
    return formatYearPart(rawYear);
  }

  return rawYear;
}

export function getFeaturedFigures(events: HistoryEvent[], limit = 6) {
  const figureMap = new Map<string, HistoryFigure>();

  events.forEach((event) => {
    event.figures?.forEach((figure) => {
      const key = figure.id || figure.name;

      if (!figureMap.has(key)) {
        figureMap.set(key, figure);
      }
    });
  });

  return Array.from(figureMap.values()).slice(0, limit);
}