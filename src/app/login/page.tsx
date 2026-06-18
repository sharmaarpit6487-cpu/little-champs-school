"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, LogIn, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { loginSchema } from "@/lib/validations";
import { SCHOOL_INFO } from "@/lib/school-data";
import type { z } from "zod";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
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
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      const res = await fetch("/api/auth/session");
      const session = await res.json();

      const role = session?.user?.role;
      if (["SUPER_ADMIN", "ADMIN", "ACCOUNTANT", "TEACHER"].includes(role)) {
        router.push("/erp");
      } else if (role === "PARENT") {
        router.push("/portal/parent");
      } else if (role === "STUDENT") {
        router.push("/portal/student");
      } else {
        router.push("/");
      }

      toast.success("Welcome back!");
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 hero-pattern opacity-20" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 text-white mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold text-navy">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-xl">{SCHOOL_INFO.name}</p>
              <p className="text-sm text-white/70">Portal Login</p>
            </div>
          </Link>
        </div>

        <Card className="glass-card border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" variant="gold" className="w-full gap-2" disabled={isLoading}>
                <LogIn className="h-4 w-4" />
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-lg bg-muted/50 text-sm">
              <p className="font-medium mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-muted-foreground text-xs">
                <p>Admin: admin@littlechamps.edu / admin123</p>
                <p>Parent: parent@example.com / parent123</p>
                <p>Student: student@example.com / student123</p>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              <Link href="/" className="hover:text-foreground transition-colors">
                ← Back to website
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
