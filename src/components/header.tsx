import { Scan } from "lucide-react";

export function Header() {
  return (
    <header className="absolute left-0 right-0 top-0 z-10">
      {/* Gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />

      <div className="relative flex items-center justify-between px-4 py-4 pt-safe">
        {/* Logo/Title */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400 backdrop-blur-sm">
            <Scan className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Klasifikasi
            </h1>
            <p className="text-xs font-medium text-white/60">
              Kematangan Tomat
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
