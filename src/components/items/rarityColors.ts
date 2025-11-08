import { RarityColors } from "./types";

export function getRarityColors(rarity: string): RarityColors {
  switch (rarity) {
    case "Common":
      return {
        border: "border-gray-500/20",
        shadow: "hover:shadow-[0_0_15px_rgba(156,163,175,0.3)]",
        glow: "rgba(156,163,175,0.3)",
        bg: "bg-gray-500",
        color: "#9ca3af",
        gradient: "bg-gradient-to-tr from-gray-500/10 via-transparent to-transparent",
      };
    case "Uncommon":
      return {
        border: "border-green-500/20",
        shadow: "hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]",
        glow: "rgba(34,197,94,0.3)",
        bg: "bg-green-500",
        color: "#22c55e",
        gradient: "bg-gradient-to-tr from-green-500/10 via-transparent to-transparent",
      };
    case "Rare":
      return {
        border: "border-blue-500/20",
        shadow: "hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]",
        glow: "rgba(59,130,246,0.3)",
        bg: "bg-blue-500",
        color: "#3b82f6",
        gradient: "bg-gradient-to-tr from-blue-500/10 via-transparent to-transparent",
      };
    case "Epic":
      return {
        border: "border-[#cd3e9b]/20",
        shadow: "hover:shadow-[0_0_15px_rgba(205,62,155,0.4)]",
        glow: "rgba(205,62,155,0.4)",
        bg: "bg-[#cd3e9b]",
        color: "#cd3e9b",
        gradient: "bg-gradient-to-tr from-[#cd3e9b]/15 via-transparent to-transparent",
      };
    case "Legendary":
      return {
        border: "border-orange-500/20",
        shadow: "hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]",
        glow: "rgba(249,115,22,0.3)",
        bg: "bg-orange-500",
        color: "#f97316",
        gradient: "bg-gradient-to-tr from-orange-500/10 via-transparent to-transparent",
      };
    default:
      return {
        border: "border-gray-700/20",
        shadow: "hover:shadow-[0_0_15px_rgba(55,65,81,0.3)]",
        glow: "rgba(55,65,81,0.3)",
        bg: "bg-gray-700",
        color: "#374151",
        gradient: "bg-gradient-to-tr from-gray-700/10 via-transparent to-transparent",
      };
  }
}
