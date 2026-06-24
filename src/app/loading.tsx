export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-ivory z-50">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border-2 border-charcoal/10 rounded-full" />
          <div className="absolute inset-0 border-2 border-transparent border-t-terracotta rounded-full animate-spin" />
        </div>
        <p className="text-[11px] uppercase tracking-editorial text-muted">
          Loading
        </p>
      </div>
    </div>
  );
}
