import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Định nghĩa kiểu dữ liệu cho bài viết để TypeScript không báo đỏ
export interface HistoryEvent {
  id: string;
  title: string;
  shortSummary: string;
  year: string;
  period: string;
  category: string;
  image: string;
  content: string;
  figures: any[];
  tags: any[];
}

export const historyService = {
  // Lấy tất cả bài viết
 getAllArticles: async (): Promise<HistoryEvent[]> => {
    try {
      console.log("Đang gọi API đến:", `${API_BASE_URL}/history/articles`);
      const response = await axios.get(`${API_BASE_URL}/history/articles`);
      
      console.log("Dữ liệu thô từ Backend:", response.data); // Xem dữ liệu thô

      if (!response.data || response.data.length === 0) {
        console.warn("Backend trả về mảng rỗng!");
        return [];
      }

      const mappedData = response.data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title || "Không tiêu đề",
        shortSummary: item.content ? item.content.substring(0, 150) + "..." : "Không có nội dung",
        year: item.period ? `${item.period.startYear} - ${item.period.endYear}` : "Không rõ",
        period: item.period ? item.period.name : "Không rõ",
        category: item.articleType === 'EVENT' ? 'trieu-dai' : 'hien-dai',
        image: item.imageUrl || "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=600&auto=format&fit=crop",
        content: item.content || "",
        figures: [],
        tags: []
      }));

      console.log("Dữ liệu sau khi Mapping:", mappedData); // Xem dữ liệu sau khi sửa
      return mappedData;
    } catch (error) {
      console.error("Lỗi kết nối API rước khi lấy dữ liệu:", error);
      return [];
    }
  },

  // Lấy chi tiết 1 bài viết - HÀM ĐANG BỊ ĐỎ
  getArticleById: async (id: string): Promise<HistoryEvent | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history/articles/${id}`);
      const item = response.data;
      if (!item) return null;

      return {
        id: item.id.toString(),
        title: item.title,
        shortSummary: item.content ? item.content.substring(0, 150) + "..." : "",
        year: item.period ? `${item.period.startYear} - ${item.period.endYear}` : "Không rõ",
        period: item.period ? item.period.name : "Không rõ",
        category: item.articleType === 'EVENT' ? 'trieu-dai' : 'hien-dai',
        image: item.imageUrl || "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=600&auto=format&fit=crop",
        content: item.content,
        figures: [],
        tags: []
      };
    } catch (error) {
      console.error("Lỗi API chi tiết:", error);
      return null;
    }
  }
};