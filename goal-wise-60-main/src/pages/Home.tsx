import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Target, Sparkles, BarChart3, Shield } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="text-center py-20 px-6 bg-gradient-to-b from-blue-50/10 to-background"
      >
        <motion.h1
          variants={item}
          className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent"
        >
          Personalized Financial Goal Planner
        </motion.h1>
        <motion.p
          variants={item}
          className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          An AI-powered platform that transforms your financial goals into structured,
          trackable savings plans — because smart goals deserve smarter tools.
        </motion.p>
        <motion.p variants={item} className="italic mt-4 text-sm text-muted-foreground">
          “Plan smart. Save better. Achieve faster.”
        </motion.p>
        <motion.div variants={item} className="mt-10 flex justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/auth")}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/about")}>
            Learn More
          </Button>
        </motion.div>
      </motion.section>

      {/* Project Info Section */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-6 py-20 grid gap-12 md:grid-cols-2"
      >
        {/* What is the Project */}
        <motion.div variants={item} className="p-8 rounded-2xl border border-blue-500/20 bg-card/40 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-7 h-7 text-blue-600" />
            <h2 className="text-2xl font-semibold">What is the Project About?</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-justify">
            <strong>GoalWise AI</strong> allows users to input financial goals naturally, such as
            “Save ₹50,000 for a laptop by March 2026.” The system uses NLP to extract key details
            and automatically generates an intelligent savings plan with easy progress tracking.
          </p>
        </motion.div>

        {/* Purpose */}
        <motion.div variants={item} className="p-8 rounded-2xl border border-indigo-500/20 bg-card/40 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-7 h-7 text-indigo-500" />
            <h2 className="text-2xl font-semibold">Purpose</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-justify">
            To simplify financial planning using natural language and AI — reducing the effort of
            manual budgeting while helping users stay consistent and motivated toward their goals.
          </p>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-blue-50/5 via-background to-purple-50/10 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
            Key Features
          </h2>
          <p className="text-muted-foreground mb-12">
            Powerful tools to help you plan, visualize, and achieve your financial dreams
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-xl border border-blue-500/20 bg-card/40 shadow-sm">
              <BarChart3 className="w-7 h-7 text-blue-600 mb-3" />
              <h4 className="text-xl font-semibold mb-2">AI-Driven NLP</h4>
              <p className="text-muted-foreground">
                Understands user goals written in plain English and converts them into structured savings plans.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-indigo-500/20 bg-card/40 shadow-sm">
              <TrendingUp className="w-7 h-7 text-indigo-500 mb-3" />
              <h4 className="text-xl font-semibold mb-2">Smart Visualization</h4>
              <p className="text-muted-foreground">
                Displays visual progress charts and analytics that evolve as you save and invest.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-purple-500/20 bg-card/40 shadow-sm">
              <Shield className="w-7 h-7 text-purple-500 mb-3" />
              <h4 className="text-xl font-semibold mb-2">Personalized Insights</h4>
              <p className="text-muted-foreground">
                Suggests optimized saving paths and milestones based on your timeline and goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About & Vision */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-6 py-20 text-center"
      >
        <motion.h2
          variants={item}
          className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent"
        >
          About & Vision
        </motion.h2>
        <motion.p
          variants={item}
          className="text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          Built for hackathons and real-world applications, <strong>GoalWise AI</strong> blends
          artificial intelligence with intuitive design to make goal tracking effortless. The
          project aims to extend into real-time financial recommendations, investment guidance,
          and collaborative savings systems.
        </motion.p>
        <motion.p variants={item} className="mt-8 text-sm text-muted-foreground">
          © 2025 GoalWise AI — Designed with precision, built for impact.
        </motion.p>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p>GoalWise AI • NLP • Visualization • Smart Financial Planning</p>
        </div>
      </footer>
    </div>
  );
}
