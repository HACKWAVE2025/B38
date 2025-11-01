import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input } = await req.json();
    const API_KEY = Deno.env.get("AI_API_KEY");

    if (!API_KEY) {
      throw new Error("AI_API_KEY is not configured");
    }

    // Replace with your actual AI model endpoint
    const response = await fetch("https://api.your-ai-endpoint.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "your-model-name",
        messages: [
          {
            role: "system",
            content: `You are a financial goal parser. Extract structured details from text input:
- title: short goal name
- amount: numeric (convert words like "fifty thousand" to number)
- deadline: ISO date (YYYY-MM-DD)
- category: one of [savings, purchase, investment, emergency, education, travel, other]

Return valid JSON with: { "title": "", "amount": 0, "deadline": "", "category": "" }.
If missing data, provide reasonable defaults.
Current date: ${new Date().toISOString().split("T")[0]}`,
          },
          { role: "user", content: input },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI API error: ${errorText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Invalid AI response");
    }

    const parsedGoal = JSON.parse(content);

    return new Response(JSON.stringify(parsedGoal), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in parse-goal:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
