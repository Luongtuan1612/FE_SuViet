import { Award, Brain } from "lucide-react";
import { difficultyOptions } from "../../constants/quizConstants";

interface QuizHeroProps {
  topicsCount: number;
  totalQuestionsLabel: string;
}

export function QuizHero({ topicsCount, totalQuestionsLabel }: QuizHeroProps) {
  return (
    <div className="relative bg-gradient-to-br from-[#8B1A1A] via-[#7A1717] to-[#4A0E0E] rounded-[2rem] p-8 md:p-10 text-white shadow-2xl mb-8 overflow-hidden">
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full" />
      <div className="absolute right-16 bottom-8 w-24 h-24 bg-[#DAA520]/30 rounded-full blur-xl" />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm mb-5">
            <Brain size={16} className="text-[#FFD36A]" />
            SuViet Learning Quiz
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Kiểm tra kiến thức lịch sử theo cấp độ
          </h1>

          <p className="text-white/75 max-w-2xl leading-relaxed mb-6">
            Hoàn thành từng mức với điểm số từ 70% để mở khóa cấp độ tiếp theo.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15">
              <div className="text-xl font-bold">{topicsCount || 14}</div>
              <div className="text-xs text-white/65">Chủ đề</div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15">
              <div className="text-xl font-bold">{totalQuestionsLabel}</div>
              <div className="text-xs text-white/65">Câu hỏi</div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15">
              <div className="text-xl font-bold">70%</div>
              <div className="text-xs text-white/65">Điều kiện mở khóa</div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="bg-white/10 backdrop-blur border border-white/15 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#DAA520] flex items-center justify-center text-[#4A0E0E]">
                <Award size={24} />
              </div>

              <div>
                <div className="font-bold">Lộ trình mở khóa</div>
                <div className="text-sm text-white/65">Dễ → Trung bình → Khó</div>
              </div>
            </div>

            <div className="space-y-3">
              {difficultyOptions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3"
                >
                  <span className="text-sm">
                    {item.emoji} {item.label}
                  </span>
                  <span className="text-sm text-white/70">
                    {item.questionCount} câu
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
