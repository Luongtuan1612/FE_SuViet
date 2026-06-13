import type { LucideIcon } from "lucide-react";
import type { QuizDifficulty } from "../../services/quizService";

export type QuizState = "select" | "difficulty" | "playing" | "result";

export interface AnswerRecord {
  questionId: string;
  selected: number;
  correct: boolean;
}

export interface UIQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UIQuizTopic {
  id: number;
  title: string;
  description: string;
  emoji: string;
  questions: UIQuizQuestion[];
}

export interface DifficultyOption {
  id: QuizDifficulty;
  label: string;
  shortLabel: string;
  description: string;
  questionCount: number;
  emoji: string;
  icon: LucideIcon;
  colorClass: string;
  badgeClass: string;
  ringClass: string;
}
