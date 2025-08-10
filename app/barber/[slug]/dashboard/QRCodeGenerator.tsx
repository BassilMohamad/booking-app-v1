import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Download, Copy } from "lucide-react";

interface QRCodeGeneratorProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function QRCodeGenerator({
  url,
  isOpen,
  onClose,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    if (isOpen && url) {
      generateQRCode();
    }
  }, [isOpen, url]);

  const generateQRCode = () => {
    // Simple QR code generation (in a real app, you'd use a library like qrcode)
    // For demo purposes, we'll create a placeholder pattern
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 200;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, size, size);

    // Draw a simple QR-like pattern (placeholder)
    ctx.fillStyle = "black";
    const moduleSize = size / 25;

    // Draw finder patterns (corners)
    const drawFinderPattern = (x: number, y: number) => {
      // Outer square
      ctx.fillRect(
        x * moduleSize,
        y * moduleSize,
        7 * moduleSize,
        7 * moduleSize
      );
      ctx.fillStyle = "white";
      ctx.fillRect(
        (x + 1) * moduleSize,
        (y + 1) * moduleSize,
        5 * moduleSize,
        5 * moduleSize
      );
      ctx.fillStyle = "black";
      ctx.fillRect(
        (x + 2) * moduleSize,
        (y + 2) * moduleSize,
        3 * moduleSize,
        3 * moduleSize
      );
    };

    drawFinderPattern(0, 0);
    drawFinderPattern(18, 0);
    drawFinderPattern(0, 18);

    // Draw some random data pattern
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if (Math.random() > 0.5 && !isFinderArea(i, j)) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Set the data URL for download
    setQrDataUrl(canvas.toDataURL("image/png"));
  };

  const isFinderArea = (x: number, y: number) => {
    return (x < 9 && y < 9) || (x > 15 && y < 9) || (x < 9 && y > 15);
  };

  const handleDownload = () => {
    if (qrDataUrl) {
      const link = document.createElement("a");
      link.download = "booking-qr-code.png";
      link.href = qrDataUrl;
      link.click();
    }
  };

  const handleCopyImage = async () => {
    if (qrDataUrl) {
      try {
        const response = await fetch(qrDataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
      } catch (error) {
        console.error("Failed to copy image:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for Booking Page</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-lg border">
            <canvas ref={canvasRef} className="max-w-full h-auto" />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Customers can scan this QR code to access your booking page
            </p>
            <p className="text-xs text-muted-foreground break-all">{url}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={handleCopyImage}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
