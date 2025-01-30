import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Filter } from "lucide-react";
import { branchData } from "@/utils/branchData";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const Index = () => {
  const [selectedBranch, setSelectedBranch] = useState("branch1");
  const [selectedFloor, setSelectedFloor] = useState("floor1");
  const { toast } = useToast();
  
  const currentBranch = branchData[selectedBranch];

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
  };

  const handleSeatSwapRequest = (seatId: number) => {
    const seat = currentBranch.seats.find(s => s.id === seatId);
    if (seat?.status === 'occupied') {
      toast({
        title: "Seat Swap Request Sent",
        description: `Request sent for seat ${seatId}`,
      });
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    toast({
      title: "Seat Updated",
      description: `Employee moved from seat ${result.source.index + 1} to ${result.destination.index + 1}`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">John Doe</span>
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 flex-1">
            <MapPin className="text-gray-500" />
            <Select value={selectedBranch} onValueChange={handleBranchChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(branchData).map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="floor1">Floor 1</SelectItem>
                <SelectItem value="floor2">Floor 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-blue-50 px-4 py-2">
            <span className="text-sm text-blue-600">Total Employees: {currentBranch.totalEmployees}</span>
          </Card>
          <Card className="bg-green-50 px-4 py-2">
            <span className="text-sm text-green-600">Power: {currentBranch.powerConsumption} kW</span>
          </Card>
          <Card className="bg-blue-50 px-4 py-2">
            <span className="text-sm text-blue-600">Water: {currentBranch.waterConsumption} L</span>
          </Card>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Input type="text" placeholder="Search by department..." className="w-full" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter seats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Seats</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="available">Available</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="space-x-4">
          <Button variant="outline" className="bg-gray-50">Main Work Area</Button>
          <Button variant="outline">Meeting Rooms</Button>
          <Button variant="outline">Break Area</Button>
        </div>

        <Card className="p-6">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="seats" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-10 gap-4"
                >
                  {currentBranch.seats.map((seat, index) => (
                    <Draggable
                      key={seat.id}
                      draggableId={`seat-${seat.id}`}
                      index={index}
                      isDragDisabled={!seat.employeeId}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative"
                          onClick={() => handleSeatSwapRequest(seat.id)}
                        >
                          <div className={`
                            w-full aspect-square rounded-lg border-2 cursor-pointer
                            ${seat.status === 'occupied' ? 'bg-red-100 border-red-500' : 
                              seat.status === 'available' ? 'bg-green-100 border-green-500' : 
                              'bg-yellow-100 border-yellow-500'}
                          `}>
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                              {seat.powerUsage}W
                            </div>
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                              {seat.id}
                            </div>
                            {seat.employeeId && (
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs">
                                {seat.employeeId}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Card>

        <div className="flex justify-between items-center">
          <Card className="bg-green-50 px-4 py-2">
            <span className="text-sm text-green-600">{currentBranch.powerConsumption} kW</span>
          </Card>
          <Card className="bg-blue-50 px-4 py-2">
            <span className="text-sm text-blue-600">{(currentBranch.waterConsumption / 24).toFixed(2)} L/h</span>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;