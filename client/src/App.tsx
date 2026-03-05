import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function App() {
  const [status, setStatus] = useState<string>("Connecting...");

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from("community_groups")
          .select("slug, name")
          .order("sort_order", { ascending: true });

        if (error) {
          setStatus(`Connection failed: ${error.message}`);
        } else {
          setStatus(`Connected! Found ${data?.length || 0} community groups.`);
        }
      } catch (err: any) {
        setStatus(`Connection failed: ${err.message}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-2xl font-bold text-primary">
        {status}
      </div>
    </div>
  );
}
