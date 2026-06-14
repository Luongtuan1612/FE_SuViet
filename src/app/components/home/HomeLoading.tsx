export function HomeLoading() {
  return (
    <div>
      <div className="relative min-h-[560px] flex items-center justify-center overflow-hidden bg-[#8B1A1A]">
        <div className="text-center px-4">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full border-4 border-[#DAA520]/30 border-t-[#DAA520] animate-spin" />

          <h1
            className="text-white mb-3"
            style={{ fontSize: "2rem", fontWeight: 800 }}
          >
            Đang tải dữ liệu SuViet...
          </h1>

          <p className="text-white/70 text-sm">
            Hệ thống đang lấy sự kiện lịch sử từ cơ sở dữ liệu.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
            >
              <div className="h-40 bg-gray-100 rounded-xl mb-4" />
              <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}