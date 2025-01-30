import { Layout } from "@/components/Layout";
import { FloorPlan as FloorPlanComponent } from "@/components/FloorPlan";

const FloorPlan = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Floor Plan</h1>
        <FloorPlanComponent />
      </div>
    </Layout>
  );
};

export default FloorPlan;