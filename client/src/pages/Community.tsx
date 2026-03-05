import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { usePosts, useToggleLike, useCreatePost } from "@/hooks/use-app-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Send, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function Community() {
  const [newPost, setNewPost] = useState("");
  const { data: posts, isLoading } = usePosts();
  const toggleLike = useToggleLike();
  const createPost = useCreatePost();

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;
    createPost.mutate(newPost, {
      onSuccess: () => setNewPost("")
    });
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-8">
        
        <header className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-bold text-primary">Community</h1>
          <p className="text-muted-foreground text-lg">Connect, share, and support each other.</p>
        </header>

        {/* Create Post Card */}
        <div className="bg-card rounded-3xl p-4 sm:p-6 shadow-sm border border-border">
          <div className="flex gap-4">
            <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
              <AvatarFallback className="bg-secondary text-white">YO</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea 
                placeholder="Share your journey, ask a question, or celebrate a win..."
                className="resize-none border-0 bg-muted/50 focus-visible:ring-1 focus-visible:ring-secondary min-h-[100px] rounded-2xl text-base p-4"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-secondary" />
                  Be supportive
                </div>
                <Button 
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim() || createPost.isPending}
                  className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-6 shadow-md shadow-secondary/20"
                >
                  {createPost.isPending ? "Posting..." : (
                    <>
                      Post <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-3xl border border-border space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
              </div>
            ))
          ) : (
            posts?.map((post) => (
              <div key={post.id} className="bg-card p-5 sm:p-6 rounded-3xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border border-border/50">
                    <AvatarFallback className="bg-primary/5 text-primary font-semibold text-sm sm:text-base">
                      {post.authorInitials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-bold text-foreground text-sm sm:text-base truncate pr-2">{post.authorName}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-foreground/90 text-sm sm:text-base leading-relaxed mb-4 text-balance">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => toggleLike.mutate(post.id)}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                          post.isLikedByMe 
                            ? "text-secondary" 
                            : "text-muted-foreground hover:text-secondary"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.isLikedByMe ? "fill-secondary" : ""}`} />
                        <span>{post.likes}</span>
                      </button>
                      
                      <button className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
      </div>
    </AppShell>
  );
}
