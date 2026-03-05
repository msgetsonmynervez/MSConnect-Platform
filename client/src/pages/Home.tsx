import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Flame, ArrowRight, CheckCircle2, Sparkles, Users } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="space-y-2">
          <p className="text-secondary font-medium text-sm tracking-wider uppercase">{currentDate}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Good morning, Alex.</h1>
          <p className="text-muted-foreground text-lg">Ready to stretch your mind today?</p>
        </header>

        {/* Daily Motivation / Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-none overflow-hidden relative hover-elevate">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Brain className="w-32 h-32" />
            </div>
            <CardContent className="p-8 relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  <Flame className="w-3.5 h-3.5 text-orange-300" />
                  <span>5 Day Streak</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Daily Challenge</h2>
                <p className="text-primary-foreground/80 max-w-[80%] text-balance">
                  Your personalized 10-minute cognitive circuit is ready. Focus on memory and speed today.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/train" className="inline-flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/25 active:scale-95">
                  Start Training
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card hover-elevate group">
            <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-2 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Daily Quote</h3>
                <p className="text-muted-foreground text-sm mt-2 italic text-balance">
                  "Small daily improvements over time lead to stunning results."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-display">This Week's Goals</h3>
            <Link href="/progress" className="text-sm font-semibold text-secondary hover:underline">
              View all
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border p-4 rounded-2xl flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-600 p-3 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">3 Workouts Completed</p>
                <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-secondary h-full rounded-full w-[60%]" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border p-4 rounded-2xl flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 p-3 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Community Engagement</p>
                <p className="text-sm text-muted-foreground mt-0.5">2 interactions today</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
