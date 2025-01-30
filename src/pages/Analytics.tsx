import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const locations = ["Mumbai", "Chennai", "Bangalore", "Kolkata", "Kochi"];

const generateData = () => {
  return locations.map(location => ({
    location,
    powerConsumption: Number((Math.random() * 2622.67).toFixed(2)),
    waterConsumption: Number((Math.random() * 920.95).toFixed(2)),
    occupancyRate: Number((Math.random() * 100).toFixed(2)),
  }));
};

const Analytics = () => {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const data = generateData();

  const filteredData = selectedLocation === "all" 
    ? data 
    : data.filter(item => item.location === selectedLocation);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Power Consumption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredData.reduce((acc, curr) => acc + curr.powerConsumption, 0).toFixed(2)} kW
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Water Consumption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredData.reduce((acc, curr) => acc + curr.waterConsumption, 0).toFixed(2)} L
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Occupancy Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(filteredData.reduce((acc, curr) => acc + curr.occupancyRate, 0) / filteredData.length).toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Consumption by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
                  <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="powerConsumption" name="Power (kW)" fill="#82ca9d" />
                  <Bar yAxisId="right" dataKey="waterConsumption" name="Water (L)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;