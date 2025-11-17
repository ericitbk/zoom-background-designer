import { useState, useCallback } from "react";
import { BackgroundSelector } from "@/components/BackgroundSelector";
import { UserInfoForm, UserInfo } from "@/components/UserInfoForm";
import { BackgroundPreview, Position } from "@/components/BackgroundPreview";
import { PositionSelector } from "@/components/PositionSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [selectedBackground, setSelectedBackground] = useState("tech-blue");
  const [position, setPosition] = useState<Position>("bottom");
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    position: "",
    role: "",
    division: "",
    linkedinUrl: "",
  });
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const handleUserInfoChange = (field: keyof UserInfo, value: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    setCanvas(canvas);
  }, []);

  const handleDownload = () => {
    if (!canvas) {
      toast.error("Please wait for the preview to load");
      return;
    }

    if (!userInfo.name || !userInfo.position) {
      toast.error("Please fill in at least your name and position");
      return;
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `zoom-background-${userInfo.name.replace(/\s+/g, "-").toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Background downloaded successfully!");
      }
    }, "image/png");
  };

  return (
    <div className="min-h-screen bg-gradient-accent py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Zoom Background Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Create professional Zoom backgrounds with your information and QR code
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Input Forms */}
          <div className="space-y-6">
            <Card className="p-6 bg-card shadow-soft">
              <BackgroundSelector
                selected={selectedBackground}
                onSelect={setSelectedBackground}
              />
            </Card>

            <Card className="p-6 bg-card shadow-soft">
              <PositionSelector selected={position} onSelect={setPosition} />
            </Card>

            <Card className="p-6 bg-card shadow-soft">
              <UserInfoForm data={userInfo} onChange={handleUserInfoChange} />
            </Card>

            <Button
              onClick={handleDownload}
              className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-opacity"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Background
            </Button>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-8 h-fit">
            <BackgroundPreview
              userInfo={userInfo}
              selectedBackground={selectedBackground}
              position={position}
              onCanvasReady={handleCanvasReady}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
