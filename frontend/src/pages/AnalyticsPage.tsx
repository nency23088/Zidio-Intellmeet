import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Video,
  Clock,
  CheckSquare,
  Users,
  Bot,
  Calendar,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data
const weeklyMeetings = [
  { day: "Mon", meetings: 4, duration: 180 },
  { day: "Tue", meetings: 6, duration: 240 },
  { day: "Wed", meetings: 3, duration: 120 },
  { day: "Thu", meetings: 8, duration: 360 },
  { day: "Fri", meetings: 5, duration: 200 },
  { day: "Sat", meetings: 1, duration: 45 },
  { day: "Sun", meetings: 0, duration: 0 },
];

const monthlyTrend = [
  { month: "Jan", meetings: 42, actionItems: 28, completed: 22 },
  { month: "Feb", meetings: 38, actionItems: 31, completed: 26 },
  { month: "Mar", meetings: 55, actionItems: 42, completed: 38 },
  { month: "Apr", meetings: 61, actionItems: 48, completed: 41 },
  { month: "May", meetings: 48, actionItems: 36, completed: 33 },
];

const participationData = [
  { name: "Joel Thomas", meetings: 28, talkTime: 35 },
  { name: "Sarah Connor", meetings: 24, talkTime: 28 },
  { name: "Mike Ross", meetings: 19, talkTime: 22 },
  { name: "Anna Lee", meetings: 15, talkTime: 15 },
];

const meetingTypeData = [
  { name: "Standups", value: 35, color: "#6366f1" },
  { name: "Planning", value: 25, color: "#8b5cf6" },
  { name: "Reviews", value: 20, color: "#06b6d4" },
  { name: "Client Calls", value: 12, color: "#10b981" },
  { name: "Others", value: 8, color: "#f59e0b" },
];

const productivityTrend = [
  { week: "W1", score: 72, actionCompletion: 65 },
  { week: "W2", score: 78, actionCompletion: 70 },
  { week: "W3", score: 75, actionCompletion: 68 },
  { week: "W4", score: 85, actionCompletion: 80 },
  { week: "W5", score: 87, actionCompletion: 82 },
  { week: "W6", score: 91, actionCompletion: 88 },
];

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1d27] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-xs font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
            {entry.name === "duration" ? " min" : ""}
            {entry.name === "score" || entry.name === "actionCompletion" ? "%" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Stat Card for analytics
function AnalyticsStat({
  title,
  value,
  change,
  positive,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: any;
  color: string;
}) {
  return (
    <div className="bg-[#13141a] border border-white/5 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-400">{title}</p>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", color)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-2">{value}</p>
      <div className="flex items-center gap-1">
        {positive ? (
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <TrendingDown className="w-3.5 h-3.5 text-red-400" />
        )}
        <span className={cn("text-xs font-medium", positive ? "text-emerald-400" : "text-red-400")}>
          {change}
        </span>
        <span className="text-xs text-gray-500">vs last month</span>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Analytics & Insights</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            AI-powered meeting intelligence for your team
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#13141a] border border-white/5 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Last 30 days</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Exporting analytics report...")}
            className="border-white/10 bg-transparent text-gray-300 hover:bg-white/5 gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsStat
          title="Total Meetings"
          value="244"
          change="+12% (26 more)"
          positive={true}
          icon={Video}
          color="bg-indigo-500/10 text-indigo-400"
        />
        <AnalyticsStat
          title="Hours in Meetings"
          value="87.5h"
          change="-8% (7.5h less)"
          positive={true}
          icon={Clock}
          color="bg-purple-500/10 text-purple-400"
        />
        <AnalyticsStat
          title="Action Items"
          value="184"
          change="+18% (28 more)"
          positive={true}
          icon={CheckSquare}
          color="bg-orange-500/10 text-orange-400"
        />
        <AnalyticsStat
          title="Completion Rate"
          value="82%"
          change="+5% improvement"
          positive={true}
          icon={TrendingUp}
          color="bg-emerald-500/10 text-emerald-400"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-[#13141a] border border-white/5 p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-400 text-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="productivity"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-400 text-sm"
          >
            Productivity
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-400 text-sm"
          >
            Team
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Weekly Meetings Bar Chart */}
            <div className="lg:col-span-2 bg-[#13141a] border border-white/5 rounded-xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-white">
                  Meetings This Week
                </h3>
                <span className="text-xs text-gray-500">by day</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyMeetings} barSize={32}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.03)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar
                    dataKey="meetings"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    name="meetings"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Meeting Types Pie Chart */}
            <div className="bg-[#13141a] border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-5">
                Meeting Types
              </h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={meetingTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {meetingTypeData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    formatter={(value) => [`${value}%`]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {meetingTypeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: item.color }}
                      />
                      <span className="text-xs text-gray-400">{item.name}</span>
                    </div>
                    <span className="text-xs font-medium text-white">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="bg-[#13141a] border border-white/5 rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-white">
                Monthly Trend
              </h3>
              <span className="text-xs text-gray-500">
                Meetings & Action Items
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="meetingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="actionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.03)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }}
                />
                <Area
                  type="monotone"
                  dataKey="meetings"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#meetingsGrad)"
                  name="meetings"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#actionGrad)"
                  name="completed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* Productivity Tab */}
        <TabsContent value="productivity" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Productivity Score Trend */}
            <div className="bg-[#13141a] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <Bot className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">
                  AI Productivity Score
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={productivityTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.03)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[60, 100]}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ fill: "#6366f1", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="score"
                  />
                  <Line
                    type="monotone"
                    dataKey="actionCompletion"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: "#10b981", r: 4 }}
                    name="actionCompletion"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* AI Insights Panel */}
            <div className="bg-[#13141a] border border-white/5 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">
                  AI Recommendations
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  {
                    icon: "📈",
                    title: "Productivity trending up",
                    desc: "Your team's productivity has increased by 19% over the last 6 weeks. Keep it up!",
                    color: "border-emerald-500/20 bg-emerald-500/5",
                  },
                  {
                    icon: "⏰",
                    title: "Meetings running long on Thursdays",
                    desc: "Thursday meetings average 45 min over schedule. Consider setting stricter time limits.",
                    color: "border-orange-500/20 bg-orange-500/5",
                  },
                  {
                    icon: "✅",
                    title: "Action item completion improving",
                    desc: "82% completion rate this month, up from 65% last month.",
                    color: "border-indigo-500/20 bg-indigo-500/5",
                  },
                  {
                    icon: "👥",
                    title: "Participation imbalance detected",
                    desc: "Joel and Sarah dominate 63% of talk time. Encourage equal participation.",
                    color: "border-yellow-500/20 bg-yellow-500/5",
                  },
                ].map((insight, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border",
                      insight.color
                    )}
                  >
                    <span className="text-lg">{insight.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {insight.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        {insight.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Participation Chart */}
            <div className="bg-[#13141a] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <Users className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">
                  Team Participation
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={participationData}
                  layout="vertical"
                  barSize={16}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.03)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar
                    dataKey="meetings"
                    fill="#6366f1"
                    radius={[0, 6, 6, 0]}
                    name="meetings"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Talk Time Distribution */}
            <div className="bg-[#13141a] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <Users className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">
                  Talk Time Distribution
                </h3>
              </div>
              <div className="space-y-4">
                {participationData.map((member, i) => {
                  const colors = [
                    "bg-indigo-500",
                    "bg-purple-500",
                    "bg-blue-500",
                    "bg-emerald-500",
                  ];
                  return (
                    <div key={member.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">{member.name}</span>
                        <span className="text-gray-400 font-medium">
                          {member.talkTime}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-700",
                            colors[i]
                          )}
                          style={{ width: `${member.talkTime}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
                {[
                  { label: "Most Active", value: "Joel Thomas", color: "text-indigo-400" },
                  { label: "Meetings/Week", value: "6.1 avg", color: "text-purple-400" },
                  { label: "Avg Talk Time", value: "25%", color: "text-blue-400" },
                  { label: "Engagement", value: "89%", color: "text-emerald-400" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/3 rounded-lg p-2.5">
                    <p className={cn("text-sm font-bold", s.color)}>
                      {s.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}