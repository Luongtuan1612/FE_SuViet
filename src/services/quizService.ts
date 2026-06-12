// Định nghĩa cấu trúc dữ liệu giống với Backend Java

export type QuizDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface QuizTopic {
  id: number;
  title: string;
  description: string;
  emoji: string;
}

export interface QuizQuestion {
  id: number;
  difficulty: QuizDifficulty;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: number;
  explanation: string;
}

export interface QuizSubmitPayload {
  topicId: number;
  difficulty: QuizDifficulty;
  score: number;
  totalQuestions: number;
}

export interface QuizHistoryItem {
  id: number;
  score: number;
  totalQuestions: number;
  difficulty: QuizDifficulty;
  completedAt: string;
  topicId?: number;
  topicTitle: string;
  topicEmoji?: string;
}

const API_URL = "http://localhost:8080/api/v1/quizzes";

const getToken = () => {
  return localStorage.getItem("token");
};

export const quizService = {
  // 1. Lấy danh sách chủ đề
  getAllTopics: async (): Promise<QuizTopic[]> => {
    try {
      const response = await fetch(`${API_URL}/topics`);

      if (!response.ok) {
        throw new Error("Lỗi mạng khi lấy chủ đề");
      }

      return await response.json();
    } catch (error) {
      console.error("Lỗi khi lấy chủ đề trắc nghiệm:", error);
      return [];
    }
  },

  // 2. Lấy câu hỏi theo chủ đề và mức độ
  getQuestionsByTopic: async (
    topicId: number,
    difficulty: QuizDifficulty
  ): Promise<QuizQuestion[]> => {
    try {
      const response = await fetch(
        `${API_URL}/topics/${topicId}/questions?difficulty=${difficulty}`
      );

      if (!response.ok) {
        throw new Error("Lỗi mạng khi lấy câu hỏi");
      }

      return await response.json();
    } catch (error) {
      console.error("Lỗi khi lấy câu hỏi:", error);
      return [];
    }
  },

  // 3. Lưu kết quả làm bài
  submitQuiz: async (payload: QuizSubmitPayload) => {
    const token = getToken();

    if (!token) {
      throw new Error("Người dùng chưa đăng nhập");
    }

    try {
      const response = await fetch(`${API_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi lưu kết quả bài làm");
      }

      return await response.json();
    } catch (error) {
      console.error("Lỗi khi lưu kết quả quiz:", error);
      throw error;
    }
  },

  // 4. Lấy lịch sử làm bài
  getHistory: async (): Promise<QuizHistoryItem[]> => {
    const token = getToken();

    if (!token) {
      return [];
    }

    try {
      const response = await fetch(`${API_URL}/history`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Lỗi khi lấy lịch sử làm bài");
      }

      return await response.json();
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử làm bài:", error);
      return [];
    }
  },
};