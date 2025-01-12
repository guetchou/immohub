import { MapPin, Video } from "lucide-react";
import { VisitType } from "@/types/appointment";

interface VisitTypeSelectorProps {
  value: VisitType;
  onChange: (value: VisitType) => void;
}

const VisitTypeSelector = ({ value, onChange }: VisitTypeSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Type de visite</label>
      <div className="flex gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="visitType"
            value="physical"
            checked={value === "physical"}
            onChange={(e) => onChange(e.target.value as VisitType)}
            className="text-real-primary"
          />
          <span className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            Visite physique
          </span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="visitType"
            value="virtual"
            checked={value === "virtual"}
            onChange={(e) => onChange(e.target.value as VisitType)}
            className="text-real-primary"
          />
          <span className="flex items-center">
            <Video className="w-4 h-4 mr-1" />
            Visite virtuelle
          </span>
        </label>
      </div>
    </div>
  );
};

export default VisitTypeSelector;