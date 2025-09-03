"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Cast = {
  id: string;
  name: string;
  age: number;
  profile: string;
  image_url: string;
  created_at: string;
};

export default function CastListPage() {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCasts = async () => {
      const { data, error } = await supabase.from("casts").select("*");
      if (error) {
        console.error("❌ fetch error:", error.message);
      } else {
        setCasts(data || []);
      }
      setLoading(false);
    };
    fetchCasts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {casts.map((cast) => (
        <div
          key={cast.id}
          className="border rounded-lg shadow p-4 flex flex-col items-center"
        >
          {cast.image_url && (
            <img
              src={cast.image_url}
              alt={cast.name}
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
          )}
          <h2 className="text-xl font-bold">{cast.name}</h2>
          <p className="text-gray-600">Age: {cast.age}</p>
          <p className="mt-2 text-sm">{cast.profile}</p>
        </div>
      ))}
    </div>
  );
}
