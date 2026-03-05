import { AppShell } from "@/components/AppShell";
import { useProgress } from "@/hooks/use-app-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Trophy, Target, Zap, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Progress() {
  const { data: progressData, isLoading } = useProgress();

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-primary">Your Progress</h1>
          <p className="text-muted-foreground text-lg">Track your consistency and cognitive improvements.</p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Current Streak", value: "5 Days", icon: Zap, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/20" },
            { label: "Longest Streak", value: "12 Days", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/20" },
            { label: "Sessions", value: "34", icon: Target, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/20" },
            { label: "Avg Score", value: "78%", icon: TrendingUp, color: "text-secondary", bg: "bg-secondary/10" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm hover-elevate">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Section */}
        <Card className="border border-border rounded-3xl overflow-hidden shadow-sm">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
            <CardTitle className="text-xl font-display flex items-center gap-2">
              <ActivityIcon /> Cognitive Performance (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <Skeleton className="w-full h-[300px] rounded-xl" />
            ) : (
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--secondary))" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                      activeDot={{ r: 6, fill: 'hsl(var(--secondary))', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

// Simple activity icon for the chart title
function ActivityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}
