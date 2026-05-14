import { cn } from "@/lib/utils";

export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center h-full w-full", className)}>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-white/5" />
        <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 animate-spin" />
      </div>
    </div>
  );
}