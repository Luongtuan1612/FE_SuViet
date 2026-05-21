// Định nghĩa cấu trúc dữ liệu giống hệt với Backend Java
export interface QuizTopic {
  id: number;
  title: string;
  description: string;
  emoji: string;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: number;
  explanation: string;
}

const API_URL = "http://localhost:8080/api/v1/quizzes";

export const quizService = {
  // 1. Hàm lấy danh sách Chủ đề
  getAllTopics: async (): Promise<QuizTopic[]> => {
    try {
      const response = await fetch(`${API_URL}/topics`);
      if (!response.ok) throw new Error("Lỗi mạng");
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi lấy chủ đề trắc nghiệm:", error);
      return [];
    }
  },

  // 2. Hàm lấy câu hỏi theo ID Chủ đề
  getQuestionsByTopic: async (topicId: number): Promise<QuizQuestion[]> => {
    try {
      const response = await fetch(`${API_URL}/topics/${topicId}/questions`);
      if (!response.ok) throw new Error("Lỗi mạng");
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi lấy câu hỏi:", error);
      return [];
    }
  }
};