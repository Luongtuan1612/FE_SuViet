import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";

const DEFAULT_EVENT_IMAGE = "https://placehold.co/800x450/png?text=Su+Viet";

export interface HistoricalPeriod {
  id: number;
  name: string;
  startYear: number;
  endYear: number;
  summary?: string;
  description?: string;
  image?: string;
}

export interface HistoryFigure {
  id: string;
  name: string;
  bornDied?: string;
  description?: string;
  story?: string;
  image?: string;
}

export interface HistoryEvent {
  id: string;
  title: string;
  shortSummary: string;
  year: string;
  period: string;
  periodId?: number;
  category: string;
  image: string;
  content: string;
  figures: HistoryFigure[];
  tags: string[];
}

interface HistoricalArticleApi {
  id: number;
  title?: string;
  shortSummary?: string;
  short_summary?: string;
  year?: string;
  period?: HistoricalPeriod | null;
  category?: string;
  articleType?: string;
  content?: string;
  image?: string;
  imageUrl?: string;
}

interface HistoricalFigureApi {
  id: number;
  name?: string;
  bornDied?: string;
  born_died?: string;
  description?: string;
  story?: string;
  image?: string;
  articles?: Array<{
    id: number;
  }>;
}

export const eventCategories = [
  { id: "all", label: "Tất cả", color: "bg-gray-100 text-gray-700" },
  { id: "khao-co-van-hoa", label: "Khảo cổ - Văn hóa cổ", color: "bg-amber-100 text-amber-700" },
  { id: "dung-nuoc", label: "Dựng nước", color: "bg-green-100 text-green-700" },
  { id: "khoi-nghia-phong-trao", label: "Khởi nghĩa - Phong trào", color: "bg-red-100 text-red-700" },
  { id: "chien-tranh-khang-chien", label: "Chiến tranh - Kháng chiến", color: "bg-orange-100 text-orange-700" },
  { id: "trieu-dai-chinh-quyen", label: "Triều đại - Chính quyền", color: "bg-purple-100 text-purple-700" },
  { id: "van-hoa-giao-duc", label: "Văn hóa - Giáo dục", color: "bg-blue-100 text-blue-700" },
  { id: "cai-cach-phap-luat", label: "Cải cách - Pháp luật", color: "bg-indigo-100 text-indigo-700" },
  { id: "chu-quyen-lanh-tho", label: "Chủ quyền - Lãnh thổ", color: "bg-cyan-100 text-cyan-700" },
  { id: "cach-mang", label: "Cách mạng", color: "bg-rose-100 text-rose-700" },
  { id: "ngoai-giao-hoi-nhap", label: "Ngoại giao - Hội nhập", color: "bg-teal-100 text-teal-700" },
  { id: "hien-dai-doi-moi", label: "Hiện đại - Đổi mới", color: "bg-emerald-100 text-emerald-700" },
];

export const getCategoryMeta = (categoryId?: string) => {
  return (
    eventCategories.find((category) => category.id === categoryId) || {
      id: categoryId || "khac",
      label: "Khác",
      color: "bg-gray-100 text-gray-700",
    }
  );
};

const createShortSummary = (item: HistoricalArticleApi) => {
  const summary = item.shortSummary || item.short_summary;

  if (summary && summary.trim()) {
    return summary.trim();
  }

  const content = item.content || "";
  return content.length > 160 ? `${content.substring(0, 160)}...` : content;
};

const mapFigure = (figure: HistoricalFigureApi): HistoryFigure => ({
  id: String(figure.id),
  name: figure.name || "Không rõ tên",
  bornDied: figure.bornDied || figure.born_died || "",
  description: figure.description || "",
  story: figure.story || "",
  image: figure.image || "",
});

const buildFigureMap = (figures: HistoricalFigureApi[]) => {
  const map = new Map<number, HistoryFigure[]>();

  figures.forEach((figure) => {
    const mappedFigure = mapFigure(figure);

    figure.articles?.forEach((article) => {
      if (!article?.id) return;

      const currentFigures = map.get(article.id) || [];
      const existed = currentFigures.some((item) => item.id === mappedFigure.id);

      if (!existed) {
        currentFigures.push(mappedFigure);
      }

      map.set(article.id, currentFigures);
    });
  });

  return map;
};

const mapArticle = (
  item: HistoricalArticleApi,
  figures: HistoryFigure[] = []
): HistoryEvent => {
  const category = item.category || "khac";
  const categoryMeta = getCategoryMeta(category);

  return {
    id: String(item.id),
    title: item.title || "Không tiêu đề",
    shortSummary: createShortSummary(item),
    year: item.year || "Không rõ",
    period: item.period?.name || "Không rõ thời kỳ",
    periodId: item.period?.id,
    category,
    image: item.image || item.imageUrl || DEFAULT_EVENT_IMAGE,
    content: item.content || "",
    figures,
    tags: [
      item.year || "",
      item.period?.name || "",
      categoryMeta.label,
      item.articleType || "",
      ...figures.map((figure) => figure.name),
    ].filter(Boolean),
  };
};

export const historyService = {
  getAllPeriods: async (): Promise<HistoricalPeriod[]> => {
    const response = await axios.get<HistoricalPeriod[]>(
      `${API_BASE_URL}/history/periods`
    );

    return response.data || [];
  },

  getAllArticles: async (): Promise<HistoryEvent[]> => {
    const [articlesResponse, figuresResponse] = await Promise.all([
      axios.get<HistoricalArticleApi[]>(`${API_BASE_URL}/history/articles`),
      axios
        .get<HistoricalFigureApi[]>(`${API_BASE_URL}/history/figures`)
        .catch((error) => {
          console.warn("Không lấy được danh sách nhân vật liên quan:", error);
          return { data: [] as HistoricalFigureApi[] };
        }),
    ]);

    const figureMap = buildFigureMap(figuresResponse.data || []);

    return (articlesResponse.data || []).map((item) =>
      mapArticle(item, figureMap.get(item.id) || [])
    );
  },

  getArticlesByPeriod: async (periodId: string | number): Promise<HistoryEvent[]> => {
    const [articlesResponse, figuresResponse] = await Promise.all([
      axios.get<HistoricalArticleApi[]>(
        `${API_BASE_URL}/history/articles/period/${periodId}`
      ),
      axios
        .get<HistoricalFigureApi[]>(`${API_BASE_URL}/history/figures`)
        .catch(() => ({ data: [] as HistoricalFigureApi[] })),
    ]);

    const figureMap = buildFigureMap(figuresResponse.data || []);

    return (articlesResponse.data || []).map((item) =>
      mapArticle(item, figureMap.get(item.id) || [])
    );
  },

  getArticleById: async (id: string | number): Promise<HistoryEvent | null> => {
    try {
      const [articleResponse, figuresResponse] = await Promise.all([
        axios.get<HistoricalArticleApi>(`${API_BASE_URL}/history/articles/${id}`),
        axios
          .get<HistoricalFigureApi[]>(`${API_BASE_URL}/history/figures/article/${id}`)
          .catch(() => ({ data: [] as HistoricalFigureApi[] })),
      ]);

      const item = articleResponse.data;
      if (!item) return null;

      const figures = (figuresResponse.data || []).map(mapFigure);
      return mapArticle(item, figures);
    } catch (error) {
      console.error("Lỗi API chi tiết sự kiện:", error);
      return null;
    }
  },
};
