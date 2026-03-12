import { ReactNode } from "react";
import { Navigation } from "./Navigation";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navigation />
      <main className="pb-24 pt-6 px-4 md:pt-10 md:pb-10 md:pl-72 md:pr-8 max-w-7xl mx-auto w-full min-h-screen animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}
