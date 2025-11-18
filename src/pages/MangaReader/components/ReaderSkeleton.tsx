import { Skeleton } from "@/components/ui/skeleton";

export function ReaderSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded" />
              <Skeleton className="h-10 w-10 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex items-center justify-center min-h-[calc(100vh-64px-80px)] py-8">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-[600px] w-[400px] rounded-lg" />
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
            <p className="text-white text-sm">Loading chapter...</p>
          </div>
        </div>
      </div>

      {/* Navigation Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-800 bg-gray-900/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 flex-1 max-w-md" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
