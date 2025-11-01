import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, Trash2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  monthly_target: number;
  category: string;
  status: string;
}

interface Contribution {
  created_at: string;
  amount: number;
}

interface GoalCardProps {
  goal: Goal;
  onUpdate: () => void;
}

export function GoalCard({ goal, onUpdate }: GoalCardProps) {
  const [contributionAmount, setContributionAmount] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contributions, setContributions] = useState<Contribution[]>([]);

  const progress = (goal.current_amount / goal.target_amount) * 100;
  const daysRemaining = Math.ceil(
    (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  // 🔹 Fetch this goal’s contribution history
  const fetchContributions = async () => {
    const { data, error } = await supabase
      .from("goal_contributions")
      .select("amount, created_at")
      .eq("goal_id", goal.id)
      .order("created_at", { ascending: true });
    if (!error && data) setContributions(data);
  };

  useEffect(() => {
    fetchContributions();
  }, [goal.id]);

  const handleAddContribution = async () => {
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const { error: contributionError } = await supabase
        .from("goal_contributions")
        .insert({
          goal_id: goal.id,
          amount: amount,
        });

      if (contributionError) throw contributionError;

      const newAmount = goal.current_amount + amount;
      const { error: updateError } = await supabase
        .from("financial_goals")
        .update({
          current_amount: newAmount,
          status: newAmount >= goal.target_amount ? "completed" : "active",
        })
        .eq("id", goal.id);

      if (updateError) throw updateError;

      toast.success("Contribution added!");
      setContributionAmount("");
      setDialogOpen(false);
      onUpdate();
      fetchContributions(); // Refresh chart data
    } catch (error: any) {
      toast.error(error.message || "Failed to add contribution");
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("financial_goals")
        .delete()
        .eq("id", goal.id);

      if (error) throw error;

      toast.success("Goal deleted");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete goal");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 🔹 Prepare chart data
  const chartData = contributions.map((c, index) => ({
    name: `#${index + 1}`,
    amount: c.amount,
    date: new Date(c.created_at).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
  }));

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{goal.title}</CardTitle>
            <Badge variant="secondary" className="capitalize">
              {goal.category}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm font-medium">
            <span>{formatCurrency(goal.current_amount)}</span>
            <span>{formatCurrency(goal.target_amount)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Target className="h-3 w-3" />
              Monthly Target
            </div>
            <div className="font-semibold">
              {formatCurrency(goal.monthly_target)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Calendar className="h-3 w-3" />
              {daysRemaining > 0 ? `${daysRemaining} days left` : "Overdue"}
            </div>
            <div className="font-semibold text-sm">
              {formatDate(goal.deadline)}
            </div>
          </div>
        </div>

        {/* 🔹 Individual Goal Graph */}
        {chartData.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Contribution Trend</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Add Contribution Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Add Contribution
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Contribution to {goal.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="5000"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <Button onClick={handleAddContribution} className="w-full">
                Add Contribution
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
