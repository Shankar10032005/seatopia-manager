import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

interface Seat {
  id: string;
  x: number;
  y: number;
  status: "available" | "occupied" | "reserved" | "selected";
  employee?: string;
  employeeId?: string;
  bookingDate?: string;
  location: string;
  powerConsumption: number;
  waterConsumption: number;
}

const locations = [
  "Mumbai",
  "Chennai",
  "Bangalore",
  "Kolkata",
  "Kochi"
];

// Generate 200 seats per location = 1000 seats total
const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  locations.forEach((location) => {
    for (let i = 1; i <= 200; i++) {
      const row = Math.floor((i - 1) / 20);
      const col = (i - 1) % 20;
      seats.push({
        id: `${location[0]}${i}`,
        x: 50 + col * 60,
        y: 50 + row * 60,
        status: Math.random() > 0.7 ? "occupied" : "available",
        location,
        powerConsumption: Number((Math.random() * 5).toFixed(2)),
        waterConsumption: Number((Math.random() * 2).toFixed(2)),
      });
    }
  });
  return seats;
};

const initialSeats = generateSeats();

export function FloorPlan() {
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [bookingEmployee, setBookingEmployee] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
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

  const filteredSeats = seats.filter((seat) => seat.location === selectedLocation);

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
      </div>

      <div className="relative w-full h-[600px] bg-white rounded-lg shadow-lg p-6 overflow-auto">
        <div className="absolute inset-0 p-6">
          {filteredSeats.map((seat) => (
            <Dialog key={seat.id}>
              <DialogTrigger asChild>
                <div
                  className={`absolute w-12 h-12 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                    seat.status === "available"
                      ? "bg-green-100 border-2 border-green-500"
                      : seat.status === "occupied"
                      ? "bg-red-100 border-2 border-red-500"
                      : "bg-yellow-100 border-2 border-yellow-500"
                  } ${selectedSeat === seat.id ? "ring-2 ring-blue-500" : ""}`}
                  style={{
                    left: `${seat.x}px`,
                    top: `${seat.y}px`,
                  }}
                  onClick={() => handleSeatClick(seat.id)}
                >
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                    {seat.id}
                  </div>
                  {seat.employee && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                      {seat.employee}
                    </div>
                  )}
                  {seat.bookingDate && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                      {seat.bookingDate}
                    </div>
                  )}
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Seat {seat.id}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <p>Status: {seat.status}</p>
                    <p>Location: {seat.location}</p>
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