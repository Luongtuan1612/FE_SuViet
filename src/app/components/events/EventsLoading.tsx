export function EventsLoading() {
  return (
    <div className="min-h-screen bg-[#F8F3EA]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 rounded-[28px] bg-white border border-[#eadfce] shadow-sm p-6">
          <div className="h-7 w-72 bg-gray-200 rounded-lg animate-pulse mb-3" />
          <div className="h-4 w-96 max-w-full bg-gray-100 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-[24px] overflow-hidden border border-[#eadfce] shadow-sm animate-pulse"
            >
              <div className="h-52 bg-gray-200" />
              <div className="p-5">
                <div className="h-5 bg-gray-200 rounded mb-3" />
                <div className="h-4 bg-gray-100 rounded mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
