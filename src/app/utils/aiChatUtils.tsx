import type { ReactNode } from "react";
import type { Message, Source } from "../types/aiChat";

export function isNoDataAnswer(text: string) {
  const normalized = text.toLowerCase();

  return (
    normalized.includes("chưa có đủ dữ liệu") ||
    normalized.includes("không có đủ dữ liệu") ||
    normalized.includes("chưa có dữ liệu") ||
    normalized.includes("không tìm thấy dữ liệu") ||
    normalized.includes("không thể trả lời chính xác")
  );
}

export function getAuthToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("authToken")
  );
}

export function parseSources(sources?: string | null): Source[] {
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

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function InlineSourceLogos({ sources }: { sources?: Source[] }) {
  const uniqueSources = getUniqueSources(sources);

  if (uniqueSources.length === 0) return null;

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
function renderInlineMarkdown(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-gray-800">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export function formatMarkdown(text: string, sources?: Source[]) {
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
                {renderInlineMarkdown(item)}
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

    elements.push(
      <p key={key} className="text-sm text-gray-700 leading-relaxed">
        {renderInlineMarkdown(line)}
        {isLastTextLine && <InlineSourceLogos sources={displaySources} />}
      </p>,
    );
  });

  flushList("end");
  flushTable("end-table");

  return elements;
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isWelcomeMessage(msg: Message) {
  return (
    msg.id === "welcome" ||
    msg.id === "welcome-new" ||
    msg.id === "empty-session"
  );
}
