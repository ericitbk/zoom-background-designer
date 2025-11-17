import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface BackgroundOption {
  id: string;
  name: string;
  image: string;
}

const backgrounds: BackgroundOption[] = [
  {
    id: "tech-blue",
    name: "Tech Blue",
    image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop",
  },
  {
    id: "gradient-purple",
    name: "Gradient Purple",
    image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920&h=1080&fit=crop",
  },
  {
    id: "office-clean",
    name: "Office Clean",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop",
  },
  {
    id: "modern-workspace",
    name: "Modern Workspace",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&h=1080&fit=crop",
  },
];

interface BackgroundSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export const BackgroundSelector = ({ selected, onSelect }: BackgroundSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold">Select Background</Label>
      <div className="grid grid-cols-2 gap-3">
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

export { backgrounds };
