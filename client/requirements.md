## Packages
@supabase/supabase-js | Database client and authentication
recharts | Data visualization for progress charts
date-fns | Date formatting for community feed
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility to merge tailwind classes without style conflicts

## Notes
- Supabase URL and Anon Key must be provided as environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
- wouter is used for routing as per implementation notes.
- Mock data is used via TanStack Query to simulate Supabase backend responses, as no specific database schema was provided, but the UI is fully functional and loading states are represented.
