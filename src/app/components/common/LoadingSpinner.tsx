import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  text = "Đang tải dữ liệu...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div className={`text-center py-20 text-gray-500 ${className}`}>
      <Loader2 className="animate-spin mx-auto mb-4 text-[#8B1A1A]" size={36} />
      {text}
    </div>
  );
}
