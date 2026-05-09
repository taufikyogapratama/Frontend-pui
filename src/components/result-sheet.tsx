import { Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export type RipenessResult = "ripe" | "unripe" | null;

export interface ResultSheetProps {
  result: RipenessResult;
  rawLabel: string | null;
  isOpen: boolean;
  onClose: () => void;
  imagePreview: string | null;
}

export function ResultSheet({
  result,
  rawLabel,
  isOpen,
  onClose,
  imagePreview,
}: ResultSheetProps) {
  if (!isOpen || !result || !rawLabel) return null;

  const isRipe = result === "ripe";
  const displayLabel = rawLabel === "Belum Matang" ? "Belum Matang" : rawLabel;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
      >
        <div className="rounded-t-3xl bg-card shadow-2xl">
          <div className="flex justify-center pt-4">
            <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
          </div>

          <div className="px-6 pb-10 pt-6">
            <div className="mb-6 flex items-start gap-4">
              {imagePreview && (
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-border">
                  <img
                    src={imagePreview}
                    alt="Scanned tomato"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1">
                <h2
                  id="result-title"
                  className="text-2xl font-bold tracking-tight text-card-foreground"
                >
                  Hasil Klasifikasi
                </h2>
                <p className="text-sm font-medium text-muted-foreground mt-1"></p>
              </div>
            </div>

            <div
              className={`mb-6 rounded-2xl p-6 ${
                isRipe
                  ? "bg-status-ripe text-status-ripe-foreground"
                  : "bg-status-unripe text-status-unripe-foreground"
              }`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl ${
                    isRipe ? "bg-white/20" : "bg-black/10"
                  }`}
                >
                  {isRipe ? (
                    <Check
                      className="h-10 w-10"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  ) : (
                    <Clock className="h-10 w-10" aria-hidden="true" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold uppercase tracking-wider opacity-80">
                    Status Tomat
                  </p>
                  <p className="text-3xl font-black tracking-tight">
                    {displayLabel}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl py-6 font-semibold"
                onClick={onClose}
              >
                Scan Lagi
              </Button>
              <Button
                className="flex-1 rounded-xl bg-primary py-6 font-semibold text-primary-foreground hover:bg-primary/90"
                onClick={onClose}
              >
                Selesai
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
