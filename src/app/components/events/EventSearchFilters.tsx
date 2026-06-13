import type { FormEvent } from "react";
import { Filter, Search, X } from "lucide-react";
import { eventCategories } from "../../../services/historyService";

interface EventSearchFiltersProps {
  searchQuery: string;
  activeCategory: string;
  categoryCounts: Record<string, number>;
  hasFilter: boolean;
  onSearchChange: (value: string) => void;
  onSubmitSearch: (event: FormEvent) => void;
  onClearSearch: () => void;
  onChangeCategory: (categoryId: string) => void;
  onClearAllFilters: () => void;
}

export function EventSearchFilters({
  searchQuery,
  activeCategory,
  categoryCounts,
  hasFilter,
  onSearchChange,
  onSubmitSearch,
  onClearSearch,
  onChangeCategory,
  onClearAllFilters,
}: EventSearchFiltersProps) {
  return (
    <section className="bg-white/95 backdrop-blur rounded-[28px] border border-[#eadfce] shadow-sm p-4 md:p-5 mb-6">
      <form onSubmit={onSubmitSearch} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm theo tên sự kiện, nhân vật, năm, nội dung..."
            className="w-full pl-11 pr-11 py-3 border border-[#eadfce] rounded-2xl text-sm bg-[#FFFCF7] focus:outline-none focus:ring-4 focus:ring-[#8B1A1A]/10 focus:border-[#8B1A1A]/40 transition-all"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B1A1A] transition-colors"
              aria-label="Xóa tìm kiếm"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-[#8B1A1A] text-white rounded-2xl text-sm font-semibold hover:bg-[#6B1414] active:scale-[0.99] transition-all shadow-sm"
        >
          Tìm
        </button>
      </form>

      <div className="mt-5 pt-5 border-t border-[#f0e6d7]">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <span className="h-8 w-8 rounded-xl bg-[#F5EDD8] text-[#8B4513] flex items-center justify-center">
              <Filter size={15} />
            </span>
            Phân loại sự kiện
          </div>

          {hasFilter && (
            <button
              type="button"
              onClick={onClearAllFilters}
              className="text-xs font-medium text-[#8B1A1A] hover:underline flex items-center gap-1"
            >
              <X size={13} />
              Xóa lọc
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {eventCategories.map((category) => {
            const isActive = activeCategory === category.id;
            const count = categoryCounts[category.id] || 0;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onChangeCategory(category.id)}
                className={`group shrink-0 rounded-2xl border px-3.5 py-2.5 text-left transition-all ${
                  isActive
                    ? "border-[#8B1A1A] bg-[#8B1A1A] text-white shadow-md shadow-[#8B1A1A]/20"
                    : "border-[#eadfce] bg-[#FFFCF7] text-gray-700 hover:border-[#DAA520]/70 hover:bg-[#FFF7E6]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isActive ? "bg-[#DAA520]" : "bg-[#DAA520]/70"
                    }`}
                  />
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {category.label}
                  </span>
                </div>

                <div
                  className={`mt-1 text-xs ${
                    isActive ? "text-white/75" : "text-gray-400"
                  }`}
                >
                  {count} sự kiện
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
