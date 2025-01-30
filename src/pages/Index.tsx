import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Filter } from "lucide-react";

const Index = () => {
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
            <Select defaultValue="branch1">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="branch1">Branch 1 - New York</SelectItem>
                <SelectItem value="branch2">Branch 2 - Mumbai</SelectItem>
                <SelectItem value="branch3">Branch 3 - Chennai</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="floor1">
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
            <span className="text-sm text-blue-600">Total Employees: 739</span>
          </Card>
          <Card className="bg-green-50 px-4 py-2">
            <span className="text-sm text-green-600">Power: 2622.67 kW</span>
          </Card>
          <Card className="bg-blue-50 px-4 py-2">
            <span className="text-sm text-blue-600">Water: 920.95 L</span>
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
          <div className="grid grid-cols-10 gap-4">
            {Array.from({ length: 40 }).map((_, index) => (
              <div key={index} className="relative">
                <div className={`
                  w-full aspect-square rounded-lg border-2 
                  ${index % 3 === 0 ? 'bg-green-100 border-green-500' : 
                    index % 3 === 1 ? 'bg-red-100 border-red-500' : 
                    'bg-yellow-100 border-yellow-500'}
                `}>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                    {(Math.random() * 100).toFixed(1)}W
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                    {index + 10}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-between items-center">
          <Card className="bg-green-50 px-4 py-2">
            <span className="text-sm text-green-600">5448.58 kW</span>
          </Card>
          <Card className="bg-blue-50 px-4 py-2">
            <span className="text-sm text-blue-600">190.06 L/h</span>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;