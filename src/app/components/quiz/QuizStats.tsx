import { BookOpen, Lock, Sparkles } from "lucide-react";
import { StatCard } from "../common";

interface QuizStatsProps {
  topicsCount: number;
}

export function QuizStats({ topicsCount }: QuizStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <StatCard icon={BookOpen} value={topicsCount} label="Chủ đề lịch sử" />
      <StatCard icon={Sparkles} value="3 cấp" label="Dễ · TB · Khó" />
      <StatCard icon={Lock} value="70%" label="Để mở khóa" />
    </div>
  );
}
