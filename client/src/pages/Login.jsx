import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import PublicLayout from "@/components/PublicLayout";
import { formatErrorMessage } from "@/lib/validation";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters")
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be less than 128 characters"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setAuth, setLoading, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Additional client-side validations
      if (!data.email.trim() || !data.password.trim()) {
        toast.error("Email and password are required");
        return;
      }

      const response = await authService.login({
        email: data.email.toLowerCase().trim(),
        password: data.password,
      });

      setAuth(response.user, response.token);
      toast.success(`🎉 Welcome back, ${response.user.name}!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(formatErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="flex items-center justify-center bg-gradient-to-br from-sage via-sage/90 to-sage/80 p-4 min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md shadow-xl border-2 border-teal/20">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-teal/10 rounded-full">
                <LogIn className="h-8 w-8 text-teal" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-midnight-blue">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-midnight-blue/70">
              Sign in to your Natural Language Task Manager
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-midnight-blue font-medium"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="border-teal/30 focus:border-teal"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-burgundy">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-midnight-blue font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="border-teal/30 focus:border-teal pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-midnight-blue/50 hover:text-midnight-blue"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-burgundy">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-teal hover:bg-teal/90 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-midnight-blue/70">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-teal hover:text-teal/80 font-medium underline underline-offset-4"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
