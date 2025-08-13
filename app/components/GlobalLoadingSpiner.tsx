import { useIsFetching } from "@tanstack/react-query";

export function GlobalLoadingSpinner() {
  const isFetching = useIsFetching();

  if (!isFetching) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full"></div>
    </div>
  );
}
