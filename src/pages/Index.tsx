import { useState, useCallback } from "react";
import { BackgroundSelector } from "@/components/BackgroundSelector";
import { UserInfoForm, UserInfo } from "@/components/UserInfoForm";
import { BackgroundPreview, Position } from "@/components/BackgroundPreview";
import { PositionSelector } from "@/components/PositionSelector";
import { Button } from "@/components/ui/button";
import { Download, Heart } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const [selectedBackground, setSelectedBackground] = useState("tech-blue");
  const [position, setPosition] = useState<Position>("bottom");
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    position: "",
    quote: "",
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
    <div className="min-h-screen bg-gradient-accent flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border py-4 px-6 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">
          MF Virtual Background Generator
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your professional MF Virtual Background in real-time
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Controls */}
        <aside className="w-80 bg-card border-r border-border overflow-y-auto">
          <div className="p-4 space-y-4">
            <Accordion type="multiple" defaultValue={["background", "position", "info"]} className="space-y-2">
              <AccordionItem value="background" className="border border-border rounded-lg px-4 bg-background/50">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  Select Background
                </AccordionTrigger>
                <AccordionContent>
                  <BackgroundSelector
                    selected={selectedBackground}
                    onSelect={setSelectedBackground}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="position" className="border border-border rounded-lg px-4 bg-background/50">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  Info Position
                </AccordionTrigger>
                <AccordionContent>
                  <PositionSelector selected={position} onSelect={setPosition} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="info" className="border border-border rounded-lg px-4 bg-background/50">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  Your Information
                </AccordionTrigger>
                <AccordionContent>
                  <UserInfoForm data={userInfo} onChange={handleUserInfoChange} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button
              onClick={handleDownload}
              className="w-full h-11 text-base font-semibold bg-gradient-primary hover:opacity-90 transition-opacity"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Background
            </Button>
          </div>
        </aside>

        {/* Right Panel - Live Preview */}
        <main className="flex-1 p-6 overflow-auto bg-background/30">
          <div className="max-w-5xl mx-auto">
            {/* <div className="mb-3"> */}
              {/* <h2 className="text-lg font-semibold text-foreground">Live Preview</h2> */}
              {/* <p className="text-sm text-muted-foreground">
                Your background updates automatically as you make changes
              </p> */}
            {/* </div> */}
            <BackgroundPreview
              userInfo={userInfo}
              selectedBackground={selectedBackground}
              position={position}
              onCanvasReady={handleCanvasReady}
            />
          </div>
        </main>
      </div>
      <footer className="border-t border-border bg-card/70 px-6 py-3">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          {/* <span className="inline-flex h-2 w-2 rounded-full bg-primary shadow-soft" aria-hidden="true" /> */}
          <span className="inline-flex gap-1 items-center" >Made with <Heart className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" />
          Rik</span>
          {/* <Heart className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" /> */}
        </div>
      </footer>
    </div>
  );
};

export default Index;
