import { BackButton } from "../common";

export function EventDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton to="/su-kien" label="Quay lại sự kiện" className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-72 rounded-2xl bg-gray-100 animate-pulse mb-6" />

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="h-5 bg-gray-100 rounded animate-pulse mb-4" />
            <div className="h-4 bg-gray-100 rounded animate-pulse mb-3" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-4/5" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="h-32 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse" />
          <div className="h-48 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse" />
        </div>
      </div>
    </div>
  );
}
