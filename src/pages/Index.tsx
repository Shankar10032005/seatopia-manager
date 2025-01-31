import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloorPlan } from "@/components/FloorPlan";

const Index = () => {
  const [showFloorPlan, setShowFloorPlan] = useState(false);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => setShowFloorPlan(!showFloorPlan)}>
            {showFloorPlan ? "Hide Floor Plan" : "Show Floor Plan"}
          </Button>
        </div>

        {showFloorPlan ? (
          <FloorPlan />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-2">
                <p>Total Seats: 1500</p>
                <p>Available Seats: 450</p>
                <p>Occupied Seats: 1050</p>
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Power Usage</h2>
              <div className="space-y-2">
                <p>Total Consumption: 2500 kW</p>
                <p>Average per Seat: 1.67 kW</p>
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Water Usage</h2>
              <div className="space-y-2">
                <p>Total Consumption: 750 L</p>
                <p>Average per Seat: 0.5 L</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;