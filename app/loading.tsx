export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-night">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        <p className="font-hand text-2xl text-gold-soft">just a moment...</p>
      </div>
    </div>
  );
}
