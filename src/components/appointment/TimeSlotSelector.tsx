import { Clock } from "lucide-react";

interface TimeSlotSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeSlotSelector = ({ value, onChange }: TimeSlotSelectorProps) => {
  const availableTimeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        <Clock className="w-4 h-4 inline-block mr-1" />
        Heure de visite
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded-md"
        required
      >
        <option value="">Sélectionnez une heure</option>
        {availableTimeSlots.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeSlotSelector;