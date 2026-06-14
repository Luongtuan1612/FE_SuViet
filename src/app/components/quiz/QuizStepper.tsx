import type { QuizState } from "../../types/quiz";

interface QuizStepperProps {
  state: QuizState;
}

export function QuizStepper({ state }: QuizStepperProps) {
  const steps = [
    { id: "select", label: "Chủ đề" },
    { id: "difficulty", label: "Mức độ" },
    { id: "playing", label: "Làm bài" },
    { id: "result", label: "Kết quả" },
  ];

  const currentIndex = steps.findIndex((step) => step.id === state);

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="bg-white/80 backdrop-blur rounded-2xl border border-white shadow-sm px-5 py-4">
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step, index) => {
            const active = index <= currentIndex;

            return (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    active
                      ? "bg-[#8B1A1A] text-white shadow-md"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>

                <span
                  className={`hidden sm:block text-sm font-medium ${
                    active ? "text-[#8B1A1A]" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>

                {index < steps.length - 1 && (
                  <div
                    className={`hidden md:block flex-1 h-0.5 rounded-full ${
                      index < currentIndex ? "bg-[#8B1A1A]" : "bg-gray-100"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
