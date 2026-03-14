export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-full border bg-background px-5 py-3 shadow-sm">
        <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
        <p className="text-sm font-medium text-foreground">Loading TradeFlow Pro...</p>
      </div>
    </div>
  );
}
