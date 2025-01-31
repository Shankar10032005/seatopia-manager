import { Floor } from "@/types/floor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface FloorSelectorProps {
  floors: Floor[];
  selectedFloor: number;
  onFloorChange: (floorId: number) => void;
}

export function FloorSelector({ floors, selectedFloor, onFloorChange }: FloorSelectorProps) {
  return (
    <Select value={selectedFloor.toString()} onValueChange={(value) => onFloorChange(parseInt(value))}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select floor" />
      </SelectTrigger>
      <SelectContent>
        {floors.map((floor) => (
          <SelectItem key={floor.id} value={floor.id.toString()}>
            {floor.name} - {floor.location}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}