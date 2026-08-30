import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  id,
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = "up",
  color = "orange",
  subtitle,
}) {
  const colorMap = {
    orange: {
      bg: "bg-orange-500/10 dark:bg-orange-500/15",
      text: "text-orange-500",
      border: "border-orange-500/20",
    },
    green: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      text: "text-emerald-500",
      border: "border-emerald-500/20",
    },
    blue: {
      bg: "bg-blue-500/10 dark:bg-blue-500/15",
      text: "text-blue-500",
      border: "border-blue-500/20",
    },
    amber: {
      bg: "bg-amber-500/10 dark:bg-amber-500/15",
      text: "text-amber-500",
      border: "border-amber-500/20",
    },
    purple: {
      bg: "bg-purple-500/10 dark:bg-purple-500/15",
      text: "text-purple-500",
      border: "border-purple-500/20",
    },
  };

  const scheme = colorMap[color] || colorMap.orange;

  return (
    <div
      id={id || `stat-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
      className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <h4 className="text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-heading mt-2">
            {value}
          </h4>
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${scheme.bg} ${scheme.text} ${scheme.border} border transition-transform duration-200 group-hover:scale-105`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          {trend ? (
            <div
              className={`flex items-center gap-1 font-semibold ${
                trendDirection === "up" ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {trendDirection === "up" ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{trend}</span>
            </div>
          ) : (
            <span className="text-zinc-400 dark:text-zinc-500">Overview</span>
          )}
          {subtitle && (
            <span className="text-zinc-400 dark:text-zinc-500 font-medium">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
