/**
 * 🔄 Componente de Estado de Sincronización
 *
 * Muestra información sobre la última sincronización de datos
 * con el repositorio de Arc Raiders
 */

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface SyncMetadata {
  id: string;
  last_commit_hash: string;
  last_commit_date: string;
  last_commit_message: string;
  last_sync_date: string;
}

export function SyncStatus() {
  const [metadata, setMetadata] = useState<SyncMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSyncMetadata() {
      try {
        const { data, error } = await supabase.from("sync_metadata").select("*").eq("id", "arc_raiders_data").single();

        if (!error && data) {
          setMetadata(data);
        }
      } catch (error) {
        console.error("Error fetching sync metadata:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSyncMetadata();
  }, []);

  if (loading) {
    return null; // O mostrar un skeleton
  }

  if (!metadata) {
    return null; // No mostrar nada si no hay metadata
  }

  const lastSyncDate = new Date(metadata.last_sync_date);
  const hoursSinceSync = (Date.now() - lastSyncDate.getTime()) / (1000 * 60 * 60);
  const isRecent = hoursSinceSync < 24;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className={`h-2 w-2 rounded-full ${isRecent ? "bg-green-500" : "bg-yellow-500"}`} />
      <span>Data updated {formatTimeAgo(lastSyncDate)}</span>
      <a
        href={`https://github.com/RaidTheory/arcraiders-data/commit/${metadata.last_commit_hash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors"
        title={metadata.last_commit_message}
      >
        ({metadata.last_commit_hash.substring(0, 7)})
      </a>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString();
}
