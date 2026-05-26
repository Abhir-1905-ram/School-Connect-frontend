function Shimmer({ className }: { className: string }) {
  return <div className={`skeleton-shimmer rounded-md ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Shimmer className="h-9 w-56 rounded-lg" />
        <Shimmer className="mt-2 h-5 w-40 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-[140px] rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Shimmer className="h-[360px] rounded-xl lg:col-span-3" />
        <Shimmer className="h-[360px] rounded-xl lg:col-span-2" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Shimmer className="h-[480px] rounded-xl lg:col-span-3" />
        <Shimmer className="h-[480px] rounded-xl lg:col-span-2" />
      </div>
    </div>
  );
}
