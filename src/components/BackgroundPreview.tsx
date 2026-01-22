import { useEffect, useRef, useState } from "react";
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
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [overlayColor, setOverlayColor] = useState("rgba(0, 0, 0, 0.3)");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [secondaryTextColor, setSecondaryTextColor] = useState("#FFFFFF");
  const [textShadowColor, setTextShadowColor] = useState("rgba(0, 0, 0, 0.45)");

  useEffect(() => {
    setBgLoaded(false);
    const bg = backgrounds.find((b) => b.id === selectedBackground);
    if (!bg) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      bgImageRef.current = img;
      try {
        const sampleCanvas = document.createElement("canvas");
        const sampleSize = 32;
        sampleCanvas.width = sampleSize;
        sampleCanvas.height = sampleSize;
        const sampleCtx = sampleCanvas.getContext("2d");
        if (sampleCtx) {
          sampleCtx.drawImage(img, 0, 0, sampleSize, sampleSize);
          const { data } = sampleCtx.getImageData(0, 0, sampleSize, sampleSize);
          let r = 0;
          let g = 0;
          let b = 0;
          const pixels = data.length / 4;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }
          r = Math.round(r / pixels);
          g = Math.round(g / pixels);
          b = Math.round(b / pixels);
          const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          if (luminance > 170) {
            setOverlayColor(`rgba(${Math.round(r * 0.25)}, ${Math.round(g * 0.25)}, ${Math.round(b * 0.25)}, 0.3)`);
            setTextColor("#FFFFFF");
            setSecondaryTextColor("#FFFFFF");
            setTextShadowColor("rgba(0, 0, 0, 0.55)");
          } else {
            setOverlayColor(
              `rgba(${Math.min(255, Math.round(r * 0.6 + 102))}, ${Math.min(255, Math.round(g * 0.6 + 102))}, ${Math.min(255, Math.round(b * 0.6 + 102))}, 0.4)`
            );
            setTextColor("#111111");
            setSecondaryTextColor("#FFFFFF");
            setTextShadowColor("rgba(255, 255, 255, 0.35)");
          }
        }
      } catch (error) {
        console.error("Error sampling background color:", error);
        setOverlayColor("rgba(0, 0, 0, 0.3)");
        setTextColor("#FFFFFF");
        setSecondaryTextColor("#FFFFFF");
        setTextShadowColor("rgba(0, 0, 0, 0.45)");
      } finally {
        setBgLoaded(true);
      }
    };
    img.src = bg.image;
  }, [selectedBackground]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bgLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to Zoom background dimensions (1920x1080)
    canvas.width = 1920;
    canvas.height = 1080;

    const drawBackground = async () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const img = bgImageRef.current;
      if (img) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Calculate positions based on selected position
          let overlayX = 0, overlayY = 0, overlayWidth = 0, overlayHeight = 0;
          let textX = 60, textStartY = 0;
          let qrX = 0, qrY = 0;

          const textHeight = 260;
          const textWidth = 520;
          const padding = 30;
          const sidePadding = 30;
          const groupGap = 40;

          switch (position) {
            case "bottom":
              overlayX = 0;
              overlayY = canvas.height - textHeight;
              overlayWidth = canvas.width;
              overlayHeight = textHeight;
              break;
            case "top":
              overlayX = 0;
              overlayY = 0;
              overlayWidth = canvas.width;
              overlayHeight = textHeight;
              break;
            case "left":
              overlayX = 0;
              overlayY = 0;
              overlayWidth = textWidth;
              overlayHeight = canvas.height;
              break;
            case "right":
              overlayX = canvas.width - textWidth;
              overlayY = 0;
              overlayWidth = textWidth;
              overlayHeight = canvas.height;
              break;
          }

          const isTopBottom = position === "top" || position === "bottom";
          const qrSize = isTopBottom
            ? 200
            : Math.min(textHeight, overlayWidth - sidePadding * 2);
          const qrInset = Math.round(qrSize * 0.05);
          const qrRenderSize = qrSize - qrInset * 2;

          const isLeftRight = position === "left" || position === "right";
          if (isTopBottom) {
            textX = overlayX + padding;
            qrX = overlayX + overlayWidth - qrSize - padding;
          } else if (position === "left") {
            textX = overlayX + sidePadding;
            qrX = overlayX + sidePadding;
          } else {
            textX = overlayX + overlayWidth - sidePadding;
            qrX = overlayX + overlayWidth - qrSize - sidePadding;
          }

          // Add semi-transparent overlay for text visibility
          ctx.fillStyle = overlayColor;
          ctx.fillRect(overlayX, overlayY, overlayWidth, overlayHeight);

          // Draw user info text
          ctx.shadowColor = textShadowColor;
          ctx.shadowBlur = 6;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2;
          ctx.fillStyle = textColor;
          const nameSize = 48;
          const positionSize = 32;
          const detailSize = 32;
          const lineGap = 14;
          const maxTextWidth = isLeftRight ? overlayWidth - sidePadding * 2 : overlayWidth - padding * 2;

          const wrapText = (text: string, font: string, maxWidth: number) => {
            if (maxWidth <= 0) return [text];
            ctx.font = font;
            const words = text.split(/\s+/).filter(Boolean);
            if (words.length === 0) return [text];
            const lines: string[] = [];
            let current = words[0];
            for (let i = 1; i < words.length; i += 1) {
              const next = `${current} ${words[i]}`;
              if (ctx.measureText(next).width <= maxWidth) {
                current = next;
              } else {
                lines.push(current);
                current = words[i];
              }
            }
            lines.push(current);
            return lines;
          };

          const renderLines: Array<{
            text: string;
            size: number;
            weight: "bold" | "normal";
            color: string;
            italic: boolean;
          }> = [];

          if (userInfo.name) {
            const nameFont = `bold ${nameSize}px Arial`;
            const nameLines = isLeftRight
              ? wrapText(userInfo.name, nameFont, maxTextWidth)
              : [userInfo.name];
            nameLines.forEach((line) => {
              renderLines.push({ text: line, size: nameSize, weight: "bold", color: textColor, italic: false });
            });
          }
          if (userInfo.position) {
            renderLines.push({ text: userInfo.position, size: positionSize, weight: "normal", color: textColor, italic: false });
          }
          if (userInfo.division) {
            renderLines.push({ text: userInfo.division, size: detailSize, weight: "normal", color: secondaryTextColor, italic: false });
          }
          if (userInfo.quote) {
            renderLines.push({ text: `"...${userInfo.quote}"`, size: detailSize, weight: "normal", color: secondaryTextColor, italic: true });
          }

          const textBlockHeight = renderLines.reduce(
            (sum, line, index) => sum + line.size + (index < renderLines.length - 1 ? lineGap : 0),
            0
          );
          const textBlockTop = isTopBottom
            ? overlayY + (overlayHeight - textBlockHeight) / 2
            : overlayY + sidePadding;
          let cursorY = textBlockTop;
          qrY = isTopBottom
            ? overlayY + (overlayHeight - qrSize) / 2
            : overlayY + overlayHeight - sidePadding - qrSize;

          ctx.textAlign = position === "right" ? "right" : "left";
          ctx.textBaseline = "top";
          renderLines.forEach((line) => {
            ctx.fillStyle = line.color;
            ctx.font = `${line.italic ? "italic " : ""}${line.weight === "bold" ? "bold " : ""}${line.size}px Arial`;
            ctx.fillText(line.text, textX, cursorY);
            cursorY += line.size + lineGap;
          });
          ctx.textBaseline = "alphabetic";
          ctx.textAlign = "left";
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          // Generate and draw QR code if LinkedIn URL is provided
          if (userInfo.linkedinUrl) {
            try {
              const qrDataUrl = await QRCode.toDataURL(userInfo.linkedinUrl, {
                width: qrRenderSize,
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
                ctx.fillRect(qrX, qrY, qrSize, qrSize);
                // Draw QR code
                ctx.drawImage(qrImg, qrX + qrInset, qrY + qrInset, qrRenderSize, qrRenderSize);
                
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
      }
    };

    drawBackground();
  }, [userInfo, position, bgLoaded, overlayColor, textColor, secondaryTextColor, textShadowColor, onCanvasReady]);

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
