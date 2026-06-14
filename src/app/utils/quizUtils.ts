import type { QuizDifficulty, QuizHistoryItem } from "../../services/quizService";
import { difficultyOptions, PASS_PERCENTAGE } from "../constants/quizConstants";
import type { UIQuizTopic } from "../types/quiz";

export const getDifficultyInfo = (
  difficulty?: QuizDifficulty | string | null
) => {
  return (
    difficultyOptions.find((item) => item.id === difficulty) ||
    difficultyOptions[0]
  );
};

export const getPercentage = (score: number, total: number) => {
  if (!total || total <= 0) return 0;
  return Math.round((score / total) * 100);
};

export const getHistoryPercentage = (item: QuizHistoryItem) => {
  return getPercentage(item.score, item.totalQuestions);
};

export const hasPassedDifficulty = (
  history: QuizHistoryItem[],
  topic: UIQuizTopic,
  difficulty: QuizDifficulty
) => {
  return history.some((item) => {
    const sameTopic =
      item.topicId === topic.id || item.topicTitle === topic.title;

    const sameDifficulty = item.difficulty === difficulty;
    const percentage = getHistoryPercentage(item);

    return sameTopic && sameDifficulty && percentage >= PASS_PERCENTAGE;
  });
};

export const isDifficultyUnlocked = (
  history: QuizHistoryItem[],
  topic: UIQuizTopic,
  difficulty: QuizDifficulty
) => {
  if (difficulty === "EASY") return true;

  if (difficulty === "MEDIUM") {
    return hasPassedDifficulty(history, topic, "EASY");
  }

  if (difficulty === "HARD") {
    return hasPassedDifficulty(history, topic, "MEDIUM");
  }

  return false;
};

export const getLockMessage = (difficulty: QuizDifficulty) => {
  if (difficulty === "MEDIUM") {
    return "Bạn cần đạt từ 70% ở mức Dễ để mở khóa mức Trung bình.";
  }

  if (difficulty === "HARD") {
    return "Bạn cần đạt từ 70% ở mức Trung bình để mở khóa mức Khó.";
  }

  return "";
};
