import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GoalInputProps {
  onGoalAdded: () => void;
}

export function GoalInput({ onGoalAdded }: GoalInputProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateMonthlyTarget = (amount: number, deadline: string) => {
    const today = new Date();
    const targetDate = new Date(deadline);
    const monthsRemaining = Math.max(
      1,
      Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30))
    );
    return amount / monthsRemaining;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      // Parse the goal using NLP
      const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-goal', {
        body: { input: input.trim() }
      });

      if (parseError) throw parseError;

      // Calculate monthly target
      const monthlyTarget = calculateMonthlyTarget(parseData.amount, parseData.deadline);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Insert the goal
      const { error: insertError } = await supabase
        .from('financial_goals')
        .insert({
          user_id: user.id,
          title: parseData.title,
          target_amount: parseData.amount,
          deadline: parseData.deadline,
          category: parseData.category,
          monthly_target: monthlyTarget,
        });

      if (insertError) throw insertError;

      toast.success("Goal added successfully!");
      setInput("");
      onGoalAdded();
    } catch (error: any) {
      console.error("Error adding goal:", error);
      toast.error(error.message || "Failed to add goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Add New Goal
        </CardTitle>
        <CardDescription>
          Describe your goal in plain text (e.g., "Save ₹50,000 for a laptop by March 2026")
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Buy a bike, ₹10,000, in 6 months"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={loading || !input.trim()} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Parsing goal...
              </>
            ) : (
              "Add Goal"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}