import { BookOpen, Flame, ShieldCheck } from "lucide-react";
import type { DifficultyOption } from "../types/quiz";

export const PASS_PERCENTAGE = 70;

export const difficultyOptions: DifficultyOption[] = [
  {
    id: "EASY",
    label: "Dễ",
    shortLabel: "Cơ bản",
    description:
      "Các câu hỏi nhận biết, phù hợp để khởi động và ôn lại kiến thức nền.",
    questionCount: 10,
    emoji: "🌱",
    icon: BookOpen,
    colorClass: "from-emerald-500 to-green-600",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ringClass: "group-hover:border-emerald-300 group-hover:bg-emerald-50/40",
  },
  {
    id: "MEDIUM",
    label: "Trung bình",
    shortLabel: "Hiểu sâu",
    description:
      "Cần nắm sự kiện, nhân vật, mốc thời gian và ý nghĩa lịch sử.",
    questionCount: 20,
    emoji: "⭐",
    icon: ShieldCheck,
    colorClass: "from-amber-500 to-orange-500",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    ringClass: "group-hover:border-amber-300 group-hover:bg-amber-50/40",
  },
  {
    id: "HARD",
    label: "Khó",
    shortLabel: "Nâng cao",
    description:
      "Tập trung phân tích, so sánh, đánh giá và liên hệ tiến trình lịch sử.",
    questionCount: 20,
    emoji: "🔥",
    icon: Flame,
    colorClass: "from-red-500 to-rose-600",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    ringClass: "group-hover:border-red-300 group-hover:bg-red-50/40",
  },
];
