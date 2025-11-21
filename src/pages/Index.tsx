import { useState, useCallback } from "react";
import { BackgroundSelector } from "@/components/BackgroundSelector";
import { UserInfoForm, UserInfo } from "@/components/UserInfoForm";
import { BackgroundPreview, Position } from "@/components/BackgroundPreview";
import { PositionSelector } from "@/components/PositionSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [step, setStep] = useState(1);
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

  const totalSteps = 4;

  const handleUserInfoChange = (field: keyof UserInfo, value: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    setCanvas(canvas);
  }, []);

  const handleNext = () => {
    if (step === 3 && (!userInfo.name || !userInfo.position)) {
      toast.error("Please fill in at least your name and position");
      return;
    }
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleDownload = () => {
    if (!canvas) {
      toast.error("Please wait for the preview to load");
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

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Select Background";
      case 2:
        return "Choose Position";
      case 3:
        return "Enter Your Information";
      case 4:
        return "Preview & Download";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-accent flex items-center justify-center py-8 px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Zoom Background Generator
          </h1>
          <p className="text-muted-foreground">
            Create professional Zoom backgrounds with your information and QR code
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center items-center mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  s === step
                    ? "bg-primary text-primary-foreground"
                    : s < step
                    ? "bg-primary/60 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    s < step ? "bg-primary/60" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="p-6 bg-card shadow-soft">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {getStepTitle()}
          </h2>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {step === 1 && (
              <BackgroundSelector
                selected={selectedBackground}
                onSelect={setSelectedBackground}
              />
            )}

            {step === 2 && (
              <PositionSelector selected={position} onSelect={setPosition} />
            )}

            {step === 3 && (
              <UserInfoForm data={userInfo} onChange={handleUserInfoChange} />
            )}

            {step === 4 && (
              <div className="space-y-4">
                <BackgroundPreview
                  userInfo={userInfo}
                  selectedBackground={selectedBackground}
                  position={position}
                  onCanvasReady={handleCanvasReady}
                />
                <Button
                  onClick={handleDownload}
                  className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-opacity"
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Background
                </Button>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePrevious}
              disabled={step === 1}
              variant="outline"
              className="w-32"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {step < totalSteps && (
              <Button
                onClick={handleNext}
                className="w-32 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
