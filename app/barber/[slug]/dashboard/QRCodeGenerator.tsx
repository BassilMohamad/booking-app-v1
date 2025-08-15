"use client";
import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Download, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

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
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    if (!isOpen || !url) return;

    const timer = setTimeout(() => {
      if (!canvasRef.current) return;

      QRCode.toCanvas(canvasRef.current, url, { width: 200 }, (err) => {
        if (err) {
          console.error("QR Code generation failed:", err);
          return;
        }
        if (canvasRef.current) {
          setQrDataUrl(canvasRef.current.toDataURL("image/png"));
        }
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, url]);

  const handleDownload = () => {
    if (qrDataUrl) {
      const link = document.createElement("a");
      link.download = t("qr.filename");
      link.href = qrDataUrl;
      link.click();
      toast.success(t("qr.toastDownload")); // ✅ show translated toast
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
        toast.success(t("qr.toastCopy")); // ✅ show translated toast
      } catch (error) {
        console.error("Failed to copy image:", error);
        toast.error(t("qr.toastCopyError")); // ✅ error toast
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("qr.title")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-lg border">
            <canvas ref={canvasRef} className="max-w-full h-auto" />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {t("qr.description")}
            </p>
            <p className="text-xs text-muted-foreground break-all">{url}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              {t("qr.downloadButton")}
            </Button>
            <Button variant="outline" onClick={handleCopyImage}>
              <Copy className="h-4 w-4 mr-2" />
              {t("qr.copyButton")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
