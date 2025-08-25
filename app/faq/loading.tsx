import { LoadingSpinner } from "@/components/common";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3 text-slate-600">
        <LoadingSpinner size="lg" />
        <p className="text-sm">Loading FAQ…</p>
      </div>
    </div>
  );
}
