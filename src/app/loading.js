export default function Loading() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900 p-4">
          <div className="h-4 w-12 rounded bg-slate-800" />
          <div className="mx-auto mt-4 h-32 w-32 rounded-2xl bg-slate-800" />
          <div className="mx-auto mt-4 h-5 w-2/3 rounded bg-slate-800" />
        </div>
      ))}
    </div>
  );
}
