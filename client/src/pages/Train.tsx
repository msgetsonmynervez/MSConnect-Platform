import { AppShell } from "@/components/AppShell";
import { useExercises } from "@/hooks/use-app-data";
import { Play, Clock, Brain, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Train() {
  const { data: exercises, isLoading, isError } = useExercises();

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl mx-auto">
        
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
            <Brain className="w-10 h-10 text-secondary" />
            Training Center
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl text-balance">
            Select an exercise to challenge your cognitive skills. Regular practice helps maintain neural pathways.
          </p>
        </header>

        {/* Categories / Filters (Static UI for now) */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
          {['All', 'Memory', 'Focus', 'Logic', 'Language'].map((cat, i) => (
            <button 
              key={cat}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                i === 0 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Exercises Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-card rounded-3xl p-6 border border-border">
                <Skeleton className="h-12 w-12 rounded-2xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-6" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center bg-red-50 text-red-600 rounded-3xl flex flex-col items-center">
            <AlertCircle className="w-12 h-12 mb-4" />
            <h3 className="text-lg font-bold">Failed to load exercises</h3>
            <p>Please check your connection and try again.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises?.map((exercise) => (
              <div 
                key={exercise.id}
                className="bg-card rounded-3xl p-6 border border-border hover:shadow-xl hover:border-secondary/30 transition-all duration-300 group flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2">{exercise.title}</h3>
                <p className="text-muted-foreground text-sm flex-1 mb-6">
                  {exercise.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                  <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {exercise.durationMins} min
                  </div>
                  
                  <button className="flex items-center justify-center bg-primary text-primary-foreground hover:bg-secondary w-10 h-10 rounded-full transition-colors shadow-sm">
                    <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
