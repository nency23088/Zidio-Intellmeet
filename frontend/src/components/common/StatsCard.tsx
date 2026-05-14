import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: "indigo" | "green" | "purple" | "orange";
}

const colorMap = {
  indigo: {
    bg: "bg-indigo-500/10",
    icon: "text-indigo-400",
    border: "border-indigo-500/20",
  },
  green: {
    bg: "bg-emerald-500/10",
    icon: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  purple: {
    bg: "bg-purple-500/10",
    icon: "text-purple-400",
    border: "border-purple-500/20",
  },
  orange: {
    bg: "bg-orange-500/10",
    icon: "text-orange-400",
    border: "border-orange-500/20",
  },
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "indigo",
}: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <div className="bg-[#13141a] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border", colors.bg, colors.border)}>
          <Icon className={cn("w-5 h-5", colors.icon)} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <span className={cn("text-xs font-medium", trend.positive ? "text-emerald-400" : "text-red-400")}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
          <span className="text-xs text-gray-500 ml-1">vs last week</span>
        </div>
      )}
    </div>
  );
}