import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { loginUser } from "@/api/auth";
import { getApiErrorMessage } from "@/api/errors";
import Logo from "@/components/common/Logo";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const response = await loginUser(data);
      setAuth(response.user, response.token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Login failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-6">
            <Logo />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Welcome back</h1>
              <p className="text-sm text-gray-400 mt-1">
                Sign in to your account to continue
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 bg-[#13141a] border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20 h-11"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300 text-sm">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-[#13141a] border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500 h-11"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0a0b0f] px-3 text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            {/* Signup Link */}
            <Link to="/signup">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-white/10 bg-transparent text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200"
              >
                Create an account
              </Button>
            </Link>
          </form>
        </div>
      </div>

      {/* Right Side - Visual Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-950 via-[#0f1020] to-[#0a0b0f] items-center justify-center p-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 text-center space-y-8 max-w-md">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Meetings that{" "}
              <span className="text-indigo-400">actually work</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              AI-powered summaries, smart action items, and real-time
              collaboration — all in one place.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-3 text-left">
            {[
              {
                icon: "🤖",
                title: "AI Meeting Intelligence",
                desc: "Auto transcription & summaries",
              },
              {
                icon: "⚡",
                title: "Real-Time Collaboration",
                desc: "Chat, tasks & video in sync",
              },
              {
                icon: "📊",
                title: "Smart Analytics",
                desc: "Track productivity & engagement",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
              >
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <p className="text-white text-sm font-medium">
                    {feature.title}
                  </p>
                  <p className="text-gray-400 text-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}