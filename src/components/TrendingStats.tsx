"use client";

import { useEffect, useState } from "react";

interface TrendingStats {
  totalItemViews: number;
  totalQuestViews: number;
  topItem: string | null;
  topQuest: string | null;
}

export default function TrendingStats() {
  const [stats, setStats] = useState<TrendingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/trending?period=24h&limit=1");
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        setStats({
          totalItemViews: data.items.reduce((sum: number, item: any) => sum + item.view_count, 0),
          totalQuestViews: data.quests.reduce((sum: number, quest: any) => sum + quest.view_count, 0),
          topItem: data.items[0]?.data?.name?.en || null,
          topQuest: data.quests[0]?.data?.name?.en || null,
        });
      } catch (error) {
        console.debug("Failed to fetch trending stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) return null;

  return (
    <div className="text-xs text-gray-500 text-center space-y-1">
      <div className="flex items-center justify-center gap-4">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-[#00ffff] rounded-full animate-pulse"></span>
          {stats.totalItemViews + stats.totalQuestViews} views today
        </span>
      </div>
    </div>
  );
}
