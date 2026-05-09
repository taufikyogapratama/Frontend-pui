import { useState, useCallback } from "react";
import { CameraView } from "@/components/camera-view";
import { ControlPanel } from "@/components/control-panel";
import { ResultSheet, type RipenessResult } from "@/components/result-sheet";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";

const compressImage = (imageSrc: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const max_size = 500;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob: Blob | null) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas to Blob failed"));
          },
          "image/jpeg",
          0.8,
        );
      } else {
        reject(new Error("Canvas context is null"));
      }
    };
    img.onerror = (err: string | Event) => reject(err);
    img.src = imageSrc;
  });
};

interface ApiResponse {
  hasil_slp: string;
  hasil_mlp: string;
}

const App = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [result, setResult] = useState<RipenessResult>(null);
  const [rawLabel, setRawLabel] = useState<string | null>(null);
  const [isResultOpen, setIsResultOpen] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [captureTrigger, setCaptureTrigger] = useState<number>(0);

  const classifyTomato = useCallback(async (imageData: string) => {
    setImagePreview(imageData);
    setIsScanning(true);

    try {
      const compressedBlob: Blob = await compressImage(imageData);

      const formData = new FormData();
      formData.append("file", compressedBlob, "tomat.jpg");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/prediksi`, {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "69420" },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal merespons dari server");
      }

      const data: ApiResponse = await response.json();
      const isRipe = data.hasil_mlp === "Matang";

      setResult(isRipe ? "ripe" : "unripe");
      setRawLabel(data.hasil_mlp);

      setIsScanning(false);
      setIsResultOpen(true);
    } catch (error) {
      console.error("Error saat klasifikasi:", error);
      alert(
        "Gagal terhubung ke API peladen! Pastikan Ngrok dan FastAPI menyala.",
      );
      setIsScanning(false);
    }
  }, []);

  const handleCapture = useCallback(() => {
    setCaptureTrigger((prev) => prev + 1);
  }, []);

  const handleCameraCapture = useCallback(
    (imageData: string) => classifyTomato(imageData),
    [classifyTomato],
  );

  const handleFileUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageData = e.target?.result as string;
        if (imageData) {
          classifyTomato(imageData);
        }
      };
      reader.readAsDataURL(file);
    },
    [classifyTomato],
  );

  const handleCancel = useCallback(() => setIsScanning(false), []);

  const handleCloseResult = useCallback(() => {
    setIsResultOpen(false);
    setResult(null);
    setRawLabel(null);
    setImagePreview(null);
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="relative h-dvh w-full overflow-hidden bg-background">
        <a
          href="#main-controls"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to controls
        </a>

        <CameraView
          onCapture={handleCameraCapture}
          isScanning={isScanning}
          triggerCapture={captureTrigger}
        />

        <Header />

        <div id="main-controls">
          <ControlPanel
            onCapture={handleCapture}
            onFileUpload={handleFileUpload}
            isScanning={isScanning}
            onCancel={handleCancel}
          />
        </div>

        <ResultSheet
          result={result}
          rawLabel={rawLabel}
          isOpen={isResultOpen}
          onClose={handleCloseResult}
          imagePreview={imagePreview}
        />
      </main>
    </ThemeProvider>
  );
};

export default App;
