import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Position } from "./BackgroundPreview";

interface PositionSelectorProps {
  selected: Position;
  onSelect: (position: Position) => void;
}

export const PositionSelector = ({ selected, onSelect }: PositionSelectorProps) => {
  const positions: { value: Position; label: string }[] = [
    { value: "top", label: "Top" },
    { value: "right", label: "Right" },
    { value: "left", label: "Left" },
    { value: "bottom", label: "Bottom" },
  ];

  return (
    <div className="space-y-3">
      {/* <Label className="text-base font-semibold text-foreground">
        Info Position
      </Label> */}
      <RadioGroup value={selected} onValueChange={(value) => onSelect(value as Position)}>
        <div className="grid grid-cols-2 gap-3">
          {positions.map((pos) => (
            <div key={pos.value} className="flex items-center space-x-2">
              <RadioGroupItem value={pos.value} id={pos.value} />
              <Label htmlFor={pos.value} className="cursor-pointer font-normal">
                {pos.label}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};
