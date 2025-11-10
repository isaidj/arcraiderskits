"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  label: string;
}

export default function BackButton({ label }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 px-4 py-2 bg-[#110918] border border-[#646081] rounded-lg text-gray-300 hover:text-white hover:shadow-[0_0_20px_rgba(100,96,129,0.6)] transition-all group"
    >
      <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span className="font-medium">{label}</span>
    </button>
  );
}
