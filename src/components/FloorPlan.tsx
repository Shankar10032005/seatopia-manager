import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { FloorSelector } from "./FloorSelector";
import { Floor } from "@/types/floor";
import { useAuth } from "@/contexts/AuthContext";
import { addDays, format, isAfter, isBefore } from "date-fns";

interface Seat {
  id: string;
  x: number;
  y: number;
  status: "available" | "occupied" | "reserved" | "selected";
  type: "engineer" | "admin" | "cafeteria" | "meeting";
  employee?: string;
  employeeId?: string;
  bookingDate?: string;
  location: string;
  floorId: number;
  powerConsumption: number;
  waterConsumption: number;
}

const locations = ["Mumbai", "Chennai", "Bangalore", "Kolkata", "Kochi"];

const floors: Floor[] = locations.flatMap((location, locationIndex) =>
  Array.from({ length: 3 }, (_, i) => ({
    id: locationIndex * 3 + i + 1,
    name: `Floor ${i + 1}`,
    location,
    totalSeats: 150,
  }))
);

const generateSeatsForFloor = (floor: Floor): Seat[] => {
  const seats: Seat[] = [];
  
  // Engineering section
  const engineeringSeats = 80;
  const seatsPerRow = 8;
  const spacing = { x: 80, y: 80, margin: 40 };

  // Generate engineering seats in a grid layout
  for (let i = 0; i < engineeringSeats; i++) {
    const row = Math.floor(i / seatsPerRow);
    const col = i % seatsPerRow;
    
    // Add space for walkways every 4 seats
    const extraSpace = Math.floor(col / 4) * 40;
    
    seats.push({
      id: `${floor.location[0]}${floor.id}-ENG-${i + 1}`,
      x: spacing.margin + col * spacing.x + extraSpace,
      y: spacing.margin + row * spacing.y,
      status: Math.random() > 0.7 ? "occupied" : "available",
      type: "engineer",
      location: floor.location,
      floorId: floor.id,
      powerConsumption: Number((Math.random() * 5).toFixed(2)),
      waterConsumption: Number((Math.random() * 2).toFixed(2)),
    });
  }

  // Admin section
  const adminSeats = 20;
  const adminStartY = spacing.margin + Math.ceil(engineeringSeats / seatsPerRow) * spacing.y + 100;
  
  for (let i = 0; i < adminSeats; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    seats.push({
      id: `${floor.location[0]}${floor.id}-ADM-${i + 1}`,
      x: spacing.margin + col * (spacing.x + 20),
      y: adminStartY + row * (spacing.y + 20),
      status: Math.random() > 0.6 ? "occupied" : "available",
      type: "admin",
      location: floor.location,
      floorId: floor.id,
      powerConsumption: Number((Math.random() * 5).toFixed(2)),
      waterConsumption: Number((Math.random() * 2).toFixed(2)),
    });
  }

  // Cafeteria section
  const cafeteriaSeats = 30;
  const cafeteriaStartX = spacing.margin + seatsPerRow * spacing.x + 150;
  
  for (let i = 0; i < cafeteriaSeats; i++) {
    const row = Math.floor(i / 6);
    const col = i % 6;
    seats.push({
      id: `${floor.location[0]}${floor.id}-CAF-${i + 1}`,
      x: cafeteriaStartX + col * spacing.x,
      y: spacing.margin + row * spacing.y,
      status: Math.random() > 0.5 ? "occupied" : "available",
      type: "cafeteria",
      location: floor.location,
      floorId: floor.id,
      powerConsumption: Number((Math.random() * 3).toFixed(2)),
      waterConsumption: Number((Math.random() * 4).toFixed(2)),
    });
  }

  // Meeting rooms
  const meetingRooms = 4;
  const meetingStartY = adminStartY;
  
  for (let i = 0; i < meetingRooms; i++) {
    seats.push({
      id: `${floor.location[0]}${floor.id}-MTG-${i + 1}`,
      x: cafeteriaStartX + i * (spacing.x * 2),
      y: meetingStartY,
      status: Math.random() > 0.4 ? "occupied" : "available",
      type: "meeting",
      location: floor.location,
      floorId: floor.id,
      powerConsumption: Number((Math.random() * 8).toFixed(2)),
      waterConsumption: Number((Math.random() * 3).toFixed(2)),
    });
  }

  return seats;
};

const initialSeats = floors.flatMap(generateSeatsForFloor);

interface SwapRequest {
  id: string;
  fromSeatId: string;
  toSeatId: string;
  employeeId: string;
  employeeName: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
}

export function FloorPlan() {
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [bookingEmployee, setBookingEmployee] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [bookingDate, setBookingDate] = useState("");
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (seat?.status === "occupied" && user?.role !== "admin") {
      handleSwapRequest(seatId);
      return;
    }
    setSelectedSeat(seatId);
  };

  const handleSwapRequest = (toSeatId: string) => {
    if (!user) return;

    const newRequest: SwapRequest = {
      id: `swap-${Date.now()}`,
      fromSeatId: seats.find(s => s.employeeId === user.id)?.id || "",
      toSeatId,
      employeeId: user.id,
      employeeName: user.name,
      status: "pending",
      requestDate: new Date().toISOString(),
    };

    setSwapRequests([...swapRequests, newRequest]);
    toast({
      title: "Success",
      description: "Swap request sent to admin for approval",
    });
  };

  const handleBookSeat = (seatId: string) => {
    if (!bookingEmployee.trim() || !employeeId.trim() || !bookingDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const selectedDate = new Date(bookingDate);
    const maxDate = addDays(new Date(), 7);

    if (isAfter(selectedDate, maxDate)) {
      toast({
        title: "Error",
        description: "Booking date cannot be more than a week in advance",
        variant: "destructive",
      });
      return;
    }

    if (isBefore(selectedDate, new Date())) {
      toast({
        title: "Error",
        description: "Cannot book seats for past dates",
        variant: "destructive",
      });
      return;
    }

    if (user?.role !== 'admin' && employeeId !== user?.id) {
      toast({
        title: "Error",
        description: "You can only book seats for yourself",
        variant: "destructive",
      });
      return;
    }

    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === seatId
          ? {
              ...seat,
              status: user?.role === 'admin' ? "reserved" : "occupied",
              employee: bookingEmployee,
              employeeId: employeeId,
              bookingDate,
            }
          : seat
      )
    );

    setBookingEmployee("");
    setEmployeeId("");
    setBookingDate("");
    setSelectedSeat(null);
    
    toast({
      title: "Success",
      description: user?.role === 'admin' ? "Seat reserved successfully" : "Seat booking request sent for approval",
    });
  };

  const locationFloors = floors.filter((floor) => floor.location === selectedLocation);
  const filteredSeats = seats.filter(
    (seat) => seat.location === selectedLocation && seat.floorId === selectedFloor
  );

  const getSeatColor = (seat: Seat) => {
    if (seat.status === "occupied") return "bg-red-100 border-red-500";
    if (seat.status === "reserved") return "bg-yellow-100 border-yellow-500";
    
    switch (seat.type) {
      case "engineer":
        return "bg-blue-100 border-blue-500";
      case "admin":
        return "bg-purple-100 border-purple-500";
      case "cafeteria":
        return "bg-green-100 border-green-500";
      case "meeting":
        return "bg-orange-100 border-orange-500";
      default:
        return "bg-gray-100 border-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
            <span className="text-sm">Engineer Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 border-2 border-purple-500 rounded"></div>
            <span className="text-sm">Admin Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
            <span className="text-sm">Cafeteria</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 border-2 border-orange-500 rounded"></div>
            <span className="text-sm">Meeting Rooms</span>
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
            <div
              key={seat.id}
              style={{
                position: "absolute",
                left: `${seat.x}px`,
                top: `${seat.y}px`,
                width: seat.type === "meeting" ? "120px" : "60px",
                height: seat.type === "meeting" ? "120px" : "60px",
              }}
              className={`${getSeatColor(seat)} border-2 rounded-lg cursor-pointer transition-colors duration-200 flex items-center justify-center`}
              onClick={() => handleSeatClick(seat.id)}
            >
              <span className="text-xs font-medium">{seat.id}</span>
            </div>
          ))}
        </div>
      </div>

      {filteredSeats.map((seat) => (
        <Dialog key={seat.id} open={selectedSeat === seat.id} onOpenChange={() => setSelectedSeat(null)}>
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
                  <Input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    max={format(addDays(new Date(), 7), 'yyyy-MM-dd')}
                  />
                  <Button
                    onClick={() => handleBookSeat(seat.id)}
                    className="w-full"
                  >
                    {user?.role === 'admin' ? 'Reserve Seat' : 'Request Booking'}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      ))}

      {user?.role === 'admin' && swapRequests.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Pending Swap Requests</h2>
          <div className="space-y-4">
            {swapRequests.map((request) => (
              <div key={request.id} className="bg-white p-4 rounded-lg shadow">
                <p>Employee: {request.employeeName}</p>
                <p>From Seat: {request.fromSeatId}</p>
                <p>To Seat: {request.toSeatId}</p>
                <p>Status: {request.status}</p>
                <div className="mt-2 space-x-2">
                  <Button
                    variant="default"
                    onClick={() => {
                      // Handle approve logic
                      setSwapRequests(prev =>
                        prev.map(r =>
                          r.id === request.id ? { ...r, status: "approved" } : r
                        )
                      );
                      toast({
                        title: "Success",
                        description: "Swap request approved",
                      });
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      // Handle reject logic
                      setSwapRequests(prev =>
                        prev.map(r =>
                          r.id === request.id ? { ...r, status: "rejected" } : r
                        )
                      );
                      toast({
                        title: "Success",
                        description: "Swap request rejected",
                      });
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
