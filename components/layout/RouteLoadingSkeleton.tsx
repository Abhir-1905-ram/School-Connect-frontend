function Shimmer({ className }: { className: string }) {
  return <div className={`skeleton-shimmer rounded-md ${className}`} />;
}

/** Generic fallback while a route segment loads (client navigation). */
export function PageContentSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 md:space-y-6 md:p-6 lg:p-8">
      <Shimmer className="h-10 w-64 rounded-lg" />
      <Shimmer className="h-12 w-full max-w-3xl rounded-lg" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Shimmer key={i} className="h-[200px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function TablePageSkeleton() {
  return (
    <div className="space-y-4">
      <Shimmer className="h-10 w-64 rounded-lg" />
      <Shimmer className="h-12 w-full max-w-3xl rounded-lg" />
      <Shimmer className="h-[420px] w-full rounded-xl" />
    </div>
  );
}

export function GridPageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="space-y-4">
      <Shimmer className="h-10 w-64 rounded-lg" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <Shimmer key={i} className="h-[240px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Shimmer className="h-10 w-72 rounded-lg" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-[120px] rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Shimmer className="h-[300px] rounded-xl" />
        <Shimmer className="h-[300px] rounded-xl" />
      </div>
    </div>
  );
}

export function PaymentsPageSkeleton() {
  return (
    <div className="space-y-8">
      <Shimmer className="h-[140px] w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-[120px] rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Shimmer className="h-[320px] rounded-xl" />
        <Shimmer className="h-[320px] rounded-xl" />
      </div>
      <Shimmer className="h-[400px] w-full rounded-xl" />
    </div>
  );
}
