import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import Logo from "@/components/common/Logo";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0b0f] flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-12">
        <Logo />
      </div>

      {/* Glowing 404 */}
      <div className="relative mb-8">
        <p className="text-[160px] font-black text-white/5 leading-none select-none">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-6xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            404
          </p>
        </div>
      </div>

      {/* Message */}
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-xl font-bold text-white">Page not found</h1>
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="border-white/10 bg-transparent text-gray-300 hover:bg-white/5 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </Button>
        <Button
          onClick={() => navigate("/dashboard")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </Button>
      </div>
    </div>
  );
}