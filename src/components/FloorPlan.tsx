import { useState } from "react";

interface Seat {
  id: string;
  x: number;
  y: number;
  status: "available" | "occupied" | "selected";
  employee?: string;
}

const initialSeats: Seat[] = [
  { id: "A1", x: 100, y: 100, status: "available" },
  { id: "A2", x: 200, y: 100, status: "occupied", employee: "John Doe" },
  { id: "B1", x: 100, y: 200, status: "available" },
  { id: "B2", x: 200, y: 200, status: "occupied", employee: "Jane Smith" },
];

export function FloorPlan() {
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const handleSeatClick = (seatId: string) => {
    setSelectedSeat(seatId);
  };

  return (
    <div className="relative w-full h-[600px] bg-white rounded-lg shadow-lg p-6">
      <div className="absolute inset-0 p-6">
        {seats.map((seat) => (
          <div
            key={seat.id}
            className={`absolute w-12 h-12 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
              seat.status === "available"
                ? "bg-green-100 border-2 border-green-500"
                : seat.status === "occupied"
                ? "bg-red-100 border-2 border-red-500"
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
          </div>
        ))}
      </div>
    </div>
  );
}