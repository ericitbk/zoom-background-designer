import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { UserInfo } from "./UserInfoForm";
import { backgrounds } from "./BackgroundSelector";
import { Card } from "@/components/ui/card";

export type Position = "top" | "bottom" | "left" | "right";

interface BackgroundPreviewProps {
  userInfo: UserInfo;
  selectedBackground: string;
  position: Position;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

export const BackgroundPreview = ({ 
  userInfo, 
  selectedBackground,
  position,
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

          // Calculate positions based on selected position
          let overlayX = 0, overlayY = 0, overlayWidth = 0, overlayHeight = 0;
          let textX = 60, textStartY = 0;
          let qrX = 0, qrY = 0;
          let centerAlign = false;

          const textHeight = 250;
          const textWidth = 600;
          const qrSize = 200;
          const padding = 60;
          const centerX = canvas.width / 2;

          switch (position) {
            case "bottom":
              overlayX = 0;
              overlayY = canvas.height - textHeight;
              overlayWidth = canvas.width;
              overlayHeight = textHeight;
              textX = centerX;
              textStartY = canvas.height - 180;
              qrX = centerX - 90;
              qrY = canvas.height - 240;
              centerAlign = true;
              break;
            case "top":
              overlayX = 0;
              overlayY = 0;
              overlayWidth = canvas.width;
              overlayHeight = textHeight;
              textX = centerX;
              textStartY = 80;
              qrX = centerX - 90;
              qrY = 20;
              centerAlign = true;
              break;
            case "left":
              overlayX = 0;
              overlayY = 0;
              overlayWidth = textWidth;
              overlayHeight = canvas.height;
              textX = padding;
              textStartY = canvas.height / 2 - 80;
              qrX = padding;
              qrY = canvas.height / 2 + 100;
              centerAlign = false;
              break;
            case "right":
              overlayX = canvas.width - textWidth;
              overlayY = 0;
              overlayWidth = textWidth;
              overlayHeight = canvas.height;
              textX = canvas.width - textWidth + padding;
              textStartY = canvas.height / 2 - 80;
              qrX = canvas.width - qrSize - padding;
              qrY = canvas.height / 2 + 100;
              centerAlign = false;
              break;
          }

          // Add semi-transparent overlay for text visibility
          ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
          ctx.fillRect(overlayX, overlayY, overlayWidth, overlayHeight);

          // Set text alignment based on position
          ctx.textAlign = centerAlign ? "center" : "left";

          // Draw user info text
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 48px Arial";
          ctx.fillText(userInfo.name || "Your Name", textX, textStartY);

          ctx.font = "32px Arial";
          ctx.fillText(userInfo.position || "Your Position", textX, textStartY + 50);

          ctx.font = "28px Arial";
          ctx.fillStyle = "#E0E0E0";
          ctx.fillText(userInfo.role || "Your Role", textX, textStartY + 95);
          ctx.fillText(userInfo.division || "Your Division", textX, textStartY + 135);

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
                ctx.fillRect(qrX - 10, qrY - 10, qrSize, qrSize);
                // Draw QR code
                ctx.drawImage(qrImg, qrX, qrY, 180, 180);
                
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
  }, [userInfo, selectedBackground, position, onCanvasReady]);

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
