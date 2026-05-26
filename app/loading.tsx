function Shimmer({ className }: { className: string }) {
  return <div className={`skeleton-shimmer rounded-md ${className}`} />;
}

export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 p-8">
      <Shimmer className="h-12 w-12 rounded-full" />
      <Shimmer className="h-4 w-48 rounded-lg" />
      <Shimmer className="h-3 w-32 rounded-lg" />
    </div>
  );
}
