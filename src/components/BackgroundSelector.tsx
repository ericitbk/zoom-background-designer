import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { backgrounds } from "@/lib/backgrounds";

interface BackgroundSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export const BackgroundSelector = ({ selected, onSelect }: BackgroundSelectorProps) => {
  return (
    <div className="space-y-3">
      {/* <Label className="text-sm font-semibold">Select Background</Label> */}
      <div className="grid grid-cols-2 gap-1.5 p-1.5">
        {backgrounds.map((bg) => (
          <Card
            key={bg.id}
            className={`cursor-pointer overflow-hidden transition-all hover:shadow-medium ${
              selected === bg.id ? "ring-2 ring-primary shadow-medium" : ""
            }`}
            onClick={() => onSelect(bg.id)}
          >
            <div className="aspect-video relative">
              <img
                src={bg.image}
                alt={bg.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                <span className="text-white text-xs font-medium">{bg.name}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

