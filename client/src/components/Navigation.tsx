import { Link, useRoute } from "wouter";
import { Home, Brain, Users, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/train", label: "Train", icon: Brain },
  { href: "/community", label: "Community", icon: Users },
  { href: "/progress", label: "Progress", icon: Activity },
];

export function Navigation() {
  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-border rounded-t-2xl px-6 py-3 pb-safe">
        <ul className="flex justify-between items-center">
          {navItems.map((item) => {
            const [isActive] = useRoute(item.href);
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300",
                    isActive ? "text-secondary" : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  )}
                >
                  <Icon className={cn("w-6 h-6", isActive && "fill-secondary/20")} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Desktop Side Navigation */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-card px-4 py-8 z-40">
        <div className="flex items-center gap-3 px-4 mb-12">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl">
            <Brain className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-primary font-display tracking-tight">MSConnect</h1>
        </div>
        
        <ul className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const [isActive] = useRoute(item.href);
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 font-medium",
                    isActive 
                      ? "bg-secondary/10 text-secondary" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-primary"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive && "fill-secondary/20")} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-auto p-4 bg-muted/30 rounded-2xl border border-border/50 text-sm">
          <p className="font-medium text-foreground">Need support?</p>
          <p className="text-muted-foreground mt-1 mb-3 text-xs">Access the MS resources portal.</p>
          <button className="w-full text-center text-xs font-semibold text-secondary hover:text-secondary/80 py-2 rounded-lg bg-secondary/10 transition-colors">
            View Resources
          </button>
        </div>
      </nav>
    </>
  );
}
