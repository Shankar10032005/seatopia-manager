export interface Floor {
  id: number;
  name: string;
  location: string;
  totalSeats: number;
}

export interface SeatBooking {
  id: string;
  seatId: string;
  employeeId: string;
  employeeName: string;
  bookingDate: string;
  floorId: number;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  requestType: 'booking' | 'swap';
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'employee';
  name: string;
}