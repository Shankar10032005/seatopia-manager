import { Layout } from "@/components/Layout";
import { FloorPlan } from "@/components/FloorPlan";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Office Floor Plan</h1>
          <p className="text-gray-500 mt-2">
            View and manage office seating arrangements
          </p>
        </div>
        <FloorPlan />
      </div>
    </Layout>
  );
};

export default Index;