import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
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
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator";
import { formatErrorMessage } from "@/lib/validation";

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
      .transform((name) => name.trim()),
    email: z
      .string()
      .email("Please enter a valid email address")
      .max(100, "Email must be less than 100 characters")
      .toLowerCase()
      .refine((email) => {
        // Additional email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }, "Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { setAuth, setLoading, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  // Watch password and name for strength indicator
  const watchedPassword = watch("password", "");
  const watchedName = watch("name", "");
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Additional client-side validations
      if (data.name.trim().length === 0) {
        toast.error("Name cannot be empty");
        return;
      }

      // Check for common weak passwords
      const commonPasswords = [
        "password",
        "123456",
        "12345678",
        "qwerty",
        "abc123",
        "password123",
        "admin",
        "letmein",
        "welcome",
        "monkey",
      ];
      if (commonPasswords.includes(data.password.toLowerCase())) {
        toast.error(
          "Please choose a stronger password. Avoid common passwords."
        );
        return;
      }

      // Check if password contains name
      if (
        data.password
          .toLowerCase()
          .includes(data.name.toLowerCase().split(" ")[0])
      ) {
        toast.error("Password should not contain your name");
        return;
      }

      const response = await authService.register({
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password,
      });

      setAuth(response.user, response.token);
      toast.success(
        "🎉 Account created successfully! Welcome to the task manager!"
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
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
                <UserPlus className="h-8 w-8 text-teal" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-midnight-blue">
              Create Account
            </CardTitle>
            <CardDescription className="text-midnight-blue/70">
              Join the Natural Language Task Manager
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-midnight-blue font-medium"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="border-teal/30 focus:border-teal"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-burgundy">{errors.name.message}</p>
                )}
              </div>

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
                    placeholder="Create a password"
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
                  </button>{" "}
                </div>
                <PasswordStrengthIndicator
                  password={watchedPassword}
                  name={watchedName}
                />
                {errors.password && (
                  <p className="text-sm text-burgundy">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-midnight-blue font-medium"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="border-teal/30 focus:border-teal pr-10"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-midnight-blue/50 hover:text-midnight-blue"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-burgundy">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-teal hover:bg-teal/90 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-midnight-blue/70">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-teal hover:text-teal/80 font-medium underline underline-offset-4"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
