import { ThreatColors } from "./types";

export function getThreatColors(threat: string): ThreatColors {
  const threatLower = threat.toLowerCase();

  switch (threatLower) {
    case "low":
      return {
        bg: "bg-green-600/80",
        border: "border-green-500/20",
        text: "text-green-400",
        glow: "rgba(34, 197, 94, 0.4)",
        gradient: "hover:bg-gradient-to-br hover:from-green-950/30 hover:to-green-900/20",
        shadow: "hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]",
        color: "#22c55e",
      };
    case "moderate":
      return {
        bg: "bg-yellow-600/80",
        border: "border-yellow-500/20",
        text: "text-yellow-400",
        glow: "rgba(234, 179, 8, 0.4)",
        gradient: "hover:bg-gradient-to-br hover:from-yellow-950/30 hover:to-yellow-900/20",
        shadow: "hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]",
        color: "#eab308",
      };
    case "high":
      return {
        bg: "bg-orange-600/80",
        border: "border-orange-500/20",
        text: "text-orange-400",
        glow: "rgba(249, 115, 22, 0.4)",
        gradient: "hover:bg-gradient-to-br hover:from-orange-950/30 hover:to-orange-900/20",
        shadow: "hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]",
        color: "#f97316",
      };
    case "critical":
      return {
        bg: "bg-red-600/80",
        border: "border-red-500/20",
        text: "text-red-400",
        glow: "rgba(239, 68, 68, 0.4)",
        gradient: "hover:bg-gradient-to-br hover:from-red-950/30 hover:to-red-900/20",
        shadow: "hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]",
        color: "#ef4444",
      };
    case "extreme":
      return {
        bg: "bg-purple-600/80",
        border: "border-purple-500/20",
        text: "text-purple-400",
        glow: "rgba(168, 85, 247, 0.4)",
        gradient: "hover:bg-gradient-to-br hover:from-purple-950/30 hover:to-purple-900/20",
        shadow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]",
        color: "#a855f7",
      };
    default:
      return {
        bg: "bg-gray-600/80",
        border: "border-gray-500/20",
        text: "text-gray-400",
        glow: "rgba(107, 114, 128, 0.4)",
        gradient: "hover:bg-gradient-to-br hover:from-gray-950/30 hover:to-gray-900/20",
        shadow: "hover:shadow-[0_0_20px_rgba(107,114,128,0.3)]",
        color: "#6b7280",
      };
  }
}
