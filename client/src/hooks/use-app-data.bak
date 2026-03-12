import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ============================================================================
// MOCK DATA HOOKS
// Since we are using Supabase exclusively but lack a specific schema, 
// these hooks simulate the network calls to provide a fully functional UI.
// ============================================================================

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: 'Memory' | 'Focus' | 'Logic' | 'Language';
  durationMins: number;
  imageUrl?: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorInitials: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  isLikedByMe: boolean;
}

export interface ProgressStat {
  date: string;
  score: number;
}

const MOCK_EXERCISES: Exercise[] = [
  { id: '1', title: 'Pattern Recall', description: 'Remember the sequence of highlighted tiles.', category: 'Memory', durationMins: 5 },
  { id: '2', title: 'Word Match', description: 'Match synonyms and antonyms as fast as you can.', category: 'Language', durationMins: 3 },
  { id: '3', title: 'Focus Flow', description: 'Track the moving object among distractors.', category: 'Focus', durationMins: 4 },
  { id: '4', title: 'Logic Grid', description: 'Solve simple deductive reasoning puzzles.', category: 'Logic', durationMins: 10 },
];

const MOCK_POSTS: Post[] = [
  { id: 'p1', authorName: 'Sarah J.', authorInitials: 'SJ', content: 'Just hit a 7-day streak on my cognitive exercises! Small wins matter. 🧠✨', likes: 12, comments: 3, createdAt: new Date(Date.now() - 3600000).toISOString(), isLikedByMe: false },
  { id: 'p2', authorName: 'Michael T.', authorInitials: 'MT', content: 'Brain fog is real today, but pushing through with a quick 3-minute focus session. Remember to be kind to yourselves.', likes: 24, comments: 5, createdAt: new Date(Date.now() - 86400000).toISOString(), isLikedByMe: true },
  { id: 'p3', authorName: 'Elena R.', authorInitials: 'ER', content: 'Does anyone else find the logic puzzles actually relaxing? It feels like a mental massage.', likes: 8, comments: 1, createdAt: new Date(Date.now() - 172800000).toISOString(), isLikedByMe: false },
];

const MOCK_PROGRESS: ProgressStat[] = [
  { date: 'Mon', score: 65 },
  { date: 'Tue', score: 68 },
  { date: 'Wed', score: 62 },
  { date: 'Thu', score: 75 },
  { date: 'Fri', score: 78 },
  { date: 'Sat', score: 82 },
  { date: 'Sun', score: 85 },
];

export function useExercises() {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 600));
      return MOCK_EXERCISES;
    }
  });
}

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 800));
      return MOCK_POSTS;
    }
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId: string) => {
      await new Promise(r => setTimeout(r, 300));
      return postId;
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData<Post[]>(['posts']);
      
      if (previousPosts) {
        queryClient.setQueryData<Post[]>(['posts'], old => 
          old?.map(p => p.id === postId 
            ? { ...p, isLikedByMe: !p.isLikedByMe, likes: p.isLikedByMe ? p.likes - 1 : p.likes + 1 } 
            : p
          )
        );
      }
      return { previousPosts };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
    }
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (content: string) => {
      await new Promise(r => setTimeout(r, 600));
      const newPost: Post = {
        id: `p${Date.now()}`,
        authorName: 'You',
        authorInitials: 'YO',
        content,
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        isLikedByMe: false
      };
      return newPost;
    },
    onSuccess: (newPost) => {
      queryClient.setQueryData<Post[]>(['posts'], old => [newPost, ...(old || [])]);
    }
  });
}

export function useProgress() {
  return useQuery({
    queryKey: ['progress'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 500));
      return MOCK_PROGRESS;
    }
  });
}
