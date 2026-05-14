import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { signupUser } from "@/api/auth";
import { getApiErrorMessage } from "@/api/errors";
import Logo from "@/components/common/Logo";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      setIsLoading(true);
      const response = await signupUser({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });
      setAuth(response.user, response.token);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Signup failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] flex">
      {/* Left Side - Visual Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-950 via-[#0f1020] to-[#0a0b0f] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center space-y-8 max-w-md">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Start your{" "}
              <span className="text-indigo-400">free account</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Join thousands of teams already using IntellMeet to run smarter,
              more productive meetings.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "10k+", label: "Teams" },
              { value: "40%", label: "Less follow-up" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <p className="text-2xl font-bold text-indigo-400">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-6">
            <Logo />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">
                Create your account
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Get started for free — no credit card required
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 text-sm">
                Full name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Joel Thomas"
                  className="pl-10 bg-[#13141a] border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500 h-11"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs">{errors.name.message}</p>
              )}
            </div>

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
                  className="pl-10 bg-[#13141a] border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500 h-11"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 text-sm">
                Password
              </Label>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-gray-300 text-sm"
              >
                Confirm password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 bg-[#13141a] border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500 h-11"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0a0b0f] px-3 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <Link to="/login">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-white/10 bg-transparent text-gray-300 hover:bg-white/5 hover:text-white"
              >
                Sign in instead
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}