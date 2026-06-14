import { BookOpen } from "lucide-react";

interface EventResultsInfoProps {
  title: string;
  filteredCount: number;
  totalCount: number;
  searchQuery: string;
}

export function EventResultsInfo({
  title,
  filteredCount,
  totalCount,
  searchQuery,
}: EventResultsInfoProps) {
  return (
    <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Hiển thị{" "}
          <strong className="text-[#8B1A1A]">{filteredCount}</strong>{" "}
          trên tổng số <strong>{totalCount}</strong> sự kiện
          {searchQuery && (
            <>
              {" "}
              cho từ khóa{" "}
              <strong className="text-[#8B1A1A]">"{searchQuery}"</strong>
            </>
          )}
        </p>
      </div>

      <div className="inline-flex items-center gap-2 text-sm text-[#8B4513] bg-[#FFF7E6] border border-[#eadfce] px-3 py-2 rounded-2xl w-fit">
        <BookOpen size={15} />
        Nhấn vào thẻ để xem chi tiết
      </div>
    </section>
  );
}
