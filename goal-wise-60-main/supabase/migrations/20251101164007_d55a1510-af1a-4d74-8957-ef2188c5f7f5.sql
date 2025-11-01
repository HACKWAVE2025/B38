-- Create financial goals table
CREATE TABLE public.financial_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  deadline DATE NOT NULL,
  monthly_target DECIMAL(12, 2) NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused'))
);

-- Enable Row Level Security
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own goals" 
ON public.financial_goals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals" 
ON public.financial_goals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
ON public.financial_goals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
ON public.financial_goals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create contributions tracking table
CREATE TABLE public.goal_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.financial_goals(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  contribution_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for contributions
ALTER TABLE public.goal_contributions ENABLE ROW LEVEL SECURITY;

-- Create policies for contributions
CREATE POLICY "Users can view contributions for their goals" 
ON public.goal_contributions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.financial_goals 
  WHERE id = goal_contributions.goal_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can add contributions to their goals" 
ON public.goal_contributions 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.financial_goals 
  WHERE id = goal_contributions.goal_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can update their contributions" 
ON public.goal_contributions 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.financial_goals 
  WHERE id = goal_contributions.goal_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can delete their contributions" 
ON public.goal_contributions 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.financial_goals 
  WHERE id = goal_contributions.goal_id 
  AND user_id = auth.uid()
));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_financial_goals_updated_at
BEFORE UPDATE ON public.financial_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for goals
ALTER PUBLICATION supabase_realtime ADD TABLE public.financial_goals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.goal_contributions;