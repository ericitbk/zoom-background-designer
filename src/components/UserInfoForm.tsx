import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface UserInfo {
  name: string;
  position: string;
  role: string;
  division: string;
  linkedinUrl: string;
}

interface UserInfoFormProps {
  data: UserInfo;
  onChange: (field: keyof UserInfo, value: string) => void;
}

export const UserInfoForm = ({ data, onChange }: UserInfoFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Your Information</h3>
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="John Doe"
          className="bg-card"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          value={data.position}
          onChange={(e) => onChange("position", e.target.value)}
          placeholder="Senior Manager"
          className="bg-card"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          value={data.role}
          onChange={(e) => onChange("role", e.target.value)}
          placeholder="Product Development"
          className="bg-card"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="division">Division</Label>
        <Input
          id="division"
          value={data.division}
          onChange={(e) => onChange("division", e.target.value)}
          placeholder="Technology Department"
          className="bg-card"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn URL</Label>
        <Input
          id="linkedin"
          value={data.linkedinUrl}
          onChange={(e) => onChange("linkedinUrl", e.target.value)}
          placeholder="https://linkedin.com/in/johndoe"
          type="url"
          className="bg-card"
        />
      </div>
    </div>
  );
};
