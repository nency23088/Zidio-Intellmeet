import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Welcome back! Here's what's happening.",
  },
  "/team": {
    title: "Team",
    subtitle: "Manage your team and workspaces.",
  },
  "/analytics": {
    title: "Analytics",
    subtitle: "Track your meeting productivity.",
  },
};

export default function MainLayout() {
  const location = useLocation();
  const pageInfo = pageTitles[location.pathname] || {
    title: "IntellMeet",
    subtitle: "",
  };

  return (
    <div className="flex h-screen bg-[#0a0b0f] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title={pageInfo.title} subtitle={pageInfo.subtitle} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}