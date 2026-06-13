import { ArrowRight, Target } from "lucide-react";
import type { UIQuizTopic } from "../../types/quiz";

interface QuizTopicCardProps {
  topic: UIQuizTopic;
  index: number;
  onSelect: () => void;
}

export function QuizTopicCard({ topic, index, onSelect }: QuizTopicCardProps) {
  return (
    <button
      onClick={onSelect}
      className="group relative text-left w-full bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8B1A1A] via-[#DAA520] to-[#8B1A1A] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute -right-10 -top-10 w-28 h-28 bg-[#F5EDD8] rounded-full opacity-70 group-hover:scale-125 transition-transform duration-500" />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#FBF7F0] border border-[#F5EDD8] flex items-center justify-center text-3xl shadow-sm">
            {topic.emoji}
          </div>

          <div className="px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs text-gray-500">
            #{String(index + 1).padStart(2, "0")}
          </div>
        </div>

        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#8B1A1A] transition-colors line-clamp-1">
          {topic.title}
        </h3>

        <p className="text-gray-500 text-sm mb-5 leading-relaxed line-clamp-2">
          {topic.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Target size={14} />
            3 mức độ
          </div>

          <div className="flex items-center gap-1 text-[#8B1A1A] text-sm font-semibold group-hover:gap-2 transition-all">
            Chọn mức <ArrowRight size={15} />
          </div>
        </div>
      </div>
    </button>
  );
}
