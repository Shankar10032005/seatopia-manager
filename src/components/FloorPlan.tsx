import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { FloorSelector } from "./FloorSelector";
import { Floor } from "@/types/floor";

interface Seat {
  id: string;
  x: number;
  y: number;
  status: "available" | "occupied" | "reserved" | "selected";
  employee?: string;
  employeeId?: string;
  bookingDate?: string;
  location: string;
  floorId: number;
  powerConsumption: number;
  waterConsumption: number;
}

const locations = ["Mumbai", "Chennai", "Bangalore", "Kolkata", "Kochi"];

const floors: Floor[] = locations.flatMap((location) =>
  Array.from({ length: 3 }, (_, i) => ({
    id: location.toLowerCase().replace(/\s+/g, "-") + `-${i + 1}`,
    name: `Floor ${i + 1}`,
    location,
    totalSeats: 100,
  }))
);

const generateSeatsForFloor = (floor: Floor): Seat[] => {
  const seats: Seat[] = [];
  const seatsPerRow = 10;
  const spacing = {
    x: 80,
    y: 80,
    margin: 20,
  };

  for (let i = 0; i < floor.totalSeats; i++) {
    const row = Math.floor(i / seatsPerRow);
    const col = i % seatsPerRow;
    seats.push({
      id: `${floor.location[0]}${floor.id}-${i + 1}`,
      x: spacing.margin + col * spacing.x,
      y: spacing.margin + row * spacing.y,
      status: Math.random() > 0.7 ? "occupied" : "available",
      location: floor.location,
      floorId: parseInt(floor.id.toString()),
      powerConsumption: Number((Math.random() * 5).toFixed(2)),
      waterConsumption: Number((Math.random() * 2).toFixed(2)),
    });
  }
  return seats;
};

const initialSeats = floors.flatMap(generateSeatsForFloor);

export function FloorPlan() {
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [bookingEmployee, setBookingEmployee] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const { toast } = useToast();

  const handleSeatClick = (seatId: string) => {
    setSelectedSeat(seatId);
  };

  const handleBookSeat = (seatId: string) => {
    if (!bookingEmployee.trim() || !employeeId.trim()) {
      toast({
        title: "Error",
        description: "Please enter both employee name and ID",
        variant: "destructive",
      });
      return;
    }

    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === seatId
          ? {
              ...seat,
              status: "reserved",
              employee: bookingEmployee,
              employeeId: employeeId,
              bookingDate: new Date().toISOString().split("T")[0],
            }
          : seat
      )
    );
    setBookingEmployee("");
    setEmployeeId("");
    setSelectedSeat(null);
    
    toast({
      title: "Success",
      description: "Seat booked successfully",
    });
  };

  const locationFloors = floors.filter((floor) => floor.location === selectedLocation);
  const filteredSeats = seats.filter(
    (seat) => seat.location === selectedLocation && seat.floorId === selectedFloor
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
            <span className="text-sm">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
            <span className="text-sm">Reserved</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FloorSelector
            floors={locationFloors}
            selectedFloor={selectedFloor}
            onFloorChange={setSelectedFloor}
          />
        </div>
      </div>

      <div className="relative w-full h-[600px] bg-white rounded-lg shadow-lg p-6 overflow-auto">
        <div className="absolute inset-0 p-6">
          {filteredSeats.map((seat) => (
            <Dialog key={seat.id}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Seat {seat.id}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <p>Status: {seat.status}</p>
                    <p>Location: {seat.location}</p>
                    <p>Floor: {Math.floor(seat.floorId)}</p>
                    {seat.employee && <p>Assigned to: {seat.employee}</p>}
                    {seat.employeeId && <p>Employee ID: {seat.employeeId}</p>}
                    {seat.bookingDate && <p>Booked for: {seat.bookingDate}</p>}
                    <p>Power Consumption: {seat.powerConsumption} kW</p>
                    <p>Water Consumption: {seat.waterConsumption} L</p>
                  </div>
                  {seat.status === "available" && (
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="Enter employee name"
                        value={bookingEmployee}
                        onChange={(e) => setBookingEmployee(e.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="Enter employee ID"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                      />
                      <Button
                        onClick={() => handleBookSeat(seat.id)}
                        className="w-full"
                      >
                        Book Seat
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  );
}