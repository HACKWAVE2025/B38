import { GoalsDashboard } from "@/components/goals/GoalsDashboard";

export default function Goals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Financial Goals</h1>
        <p className="text-muted-foreground">
          Track and manage your savings goals in one place
        </p>
      </div>
      <GoalsDashboard />
    </div>
  );
}