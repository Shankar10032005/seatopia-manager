import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface Seat {
  id: string;
  x: number;
  y: number;
  status: "available" | "occupied" | "reserved" | "selected";
  employee?: string;
  bookingDate?: string;
}

const initialSeats: Seat[] = [
  { id: "A1", x: 100, y: 100, status: "available" },
  { id: "A2", x: 200, y: 100, status: "occupied", employee: "John Doe" },
  { id: "A3", x: 300, y: 100, status: "available" },
  { id: "A4", x: 400, y: 100, status: "reserved", employee: "Meeting Room" },
  { id: "B1", x: 100, y: 200, status: "available" },
  { id: "B2", x: 200, y: 200, status: "occupied", employee: "Jane Smith" },
  { id: "B3", x: 300, y: 200, status: "available" },
  { id: "B4", x: 400, y: 200, status: "available" },
  { id: "C1", x: 100, y: 300, status: "reserved", bookingDate: "2024-03-20" },
  { id: "C2", x: 200, y: 300, status: "available" },
  { id: "C3", x: 300, y: 300, status: "available" },
  { id: "C4", x: 400, y: 300, status: "occupied", employee: "Bob Wilson" },
];

export function FloorPlan() {
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [bookingEmployee, setBookingEmployee] = useState("");

  const handleSeatClick = (seatId: string) => {
    setSelectedSeat(seatId);
  };

  const handleBookSeat = (seatId: string) => {
    if (!bookingEmployee.trim()) return;

    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === seatId
          ? {
              ...seat,
              status: "reserved",
              employee: bookingEmployee,
              bookingDate: new Date().toISOString().split("T")[0],
            }
          : seat
      )
    );
    setBookingEmployee("");
    setSelectedSeat(null);
  };

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
      </div>

      <div className="relative w-full h-[600px] bg-white rounded-lg shadow-lg p-6">
        <div className="absolute inset-0 p-6">
          {seats.map((seat) => (
            <Dialog key={seat.id}>
              <DialogTrigger asChild>
                <div
                  className={`absolute w-12 h-12 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                    seat.status === "available"
                      ? "bg-green-100 border-2 border-green-500"
                      : seat.status === "occupied"
                      ? "bg-red-100 border-2 border-red-500"
                      : seat.status === "reserved"
                      ? "bg-yellow-100 border-2 border-yellow-500"
                      : "bg-blue-100 border-2 border-blue-500"
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
                    {seat.employee && <p>Assigned to: {seat.employee}</p>}
                    {seat.bookingDate && <p>Booked for: {seat.bookingDate}</p>}
                  </div>
                  {seat.status === "available" && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Enter employee name"
                        className="w-full px-3 py-2 border rounded"
                        value={bookingEmployee}
                        onChange={(e) => setBookingEmployee(e.target.value)}
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