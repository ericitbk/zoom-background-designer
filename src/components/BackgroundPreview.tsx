import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { UserInfo } from "./UserInfoForm";
import { backgrounds } from "./BackgroundSelector";
import { Card } from "@/components/ui/card";

interface BackgroundPreviewProps {
  userInfo: UserInfo;
  selectedBackground: string;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

export const BackgroundPreview = ({ 
  userInfo, 
  selectedBackground,
  onCanvasReady 
}: BackgroundPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to Zoom background dimensions (1920x1080)
    canvas.width = 1920;
    canvas.height = 1080;

    const drawBackground = async () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background image
      const bg = backgrounds.find((b) => b.id === selectedBackground);
      if (bg) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = async () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Add semi-transparent overlay for text visibility
          ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
          ctx.fillRect(0, canvas.height - 250, canvas.width, 250);

          // Draw user info text
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 48px Arial";
          ctx.fillText(userInfo.name || "Your Name", 60, canvas.height - 180);

          ctx.font = "32px Arial";
          ctx.fillText(userInfo.position || "Your Position", 60, canvas.height - 130);

          ctx.font = "28px Arial";
          ctx.fillStyle = "#E0E0E0";
          ctx.fillText(userInfo.role || "Your Role", 60, canvas.height - 85);
          ctx.fillText(userInfo.division || "Your Division", 60, canvas.height - 45);

          // Generate and draw QR code if LinkedIn URL is provided
          if (userInfo.linkedinUrl) {
            try {
              const qrDataUrl = await QRCode.toDataURL(userInfo.linkedinUrl, {
                width: 180,
                margin: 2,
                color: {
                  dark: "#000000",
                  light: "#FFFFFF",
                },
              });

              const qrImg = new Image();
              qrImg.onload = () => {
                // Draw white background for QR code
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(canvas.width - 240, canvas.height - 240, 200, 200);
                // Draw QR code
                ctx.drawImage(qrImg, canvas.width - 230, canvas.height - 230, 180, 180);
                
                onCanvasReady(canvas);
              };
              qrImg.src = qrDataUrl;
            } catch (error) {
              console.error("Error generating QR code:", error);
              onCanvasReady(canvas);
            }
          } else {
            onCanvasReady(canvas);
          }
        };
        img.src = bg.image;
      }
    };

    drawBackground();
  }, [userInfo, selectedBackground, onCanvasReady]);

  return (
    <Card className="p-4 bg-card shadow-medium">
      <h3 className="text-lg font-semibold text-foreground mb-3">Preview</h3>
      <div className="bg-muted rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-auto"
          style={{ display: "block" }}
        />
      </div>
    </Card>
  );
};
