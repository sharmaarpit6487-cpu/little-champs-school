"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SchoolLogo } from "@/components/layout/school-logo";
import { SchoolImage } from "@/components/shared/school-image";
import { SCHOOL_IMAGES } from "@/lib/school-images";
import { SCHOOL_INFO } from "@/lib/school-data";
import { loginSchema } from "@/lib/validations";
import { getDashboardPath } from "@/lib/rbac";
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

      const session = await getSession();
      const role = session?.user?.role;
      router.push(role ? getDashboardPath(role) : "/");
      router.refresh();
      toast.success("Welcome back!");
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-blob" aria-hidden="true" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-amber-400/10 dark:bg-amber-400/5 rounded-full blur-3xl animate-blob" aria-hidden="true" />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-brand-blue/20 to-brand-yellow/20 rounded-[2rem] blur-xl" />
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20">
            <SchoolImage
              src={SCHOOL_IMAGES.campus}
              alt="Little Champs School campus"
              width={560}
              height={640}
              sizes="50vw"
              priority
              className="w-full aspect-[7/8]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="font-display text-2xl font-bold mb-2">{SCHOOL_INFO.name}</p>
              <p className="text-white/90 text-sm">{SCHOOL_INFO.address}, {SCHOOL_INFO.city}</p>
              <p className="mt-3 font-display text-xl text-brand-yellow italic">{SCHOOL_INFO.motto}</p>
            </div>
          </div>
        </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md mx-auto lg:max-w-none"
      >
        <div className="text-center mb-8">
          <Link href="/" aria-label="Go to homepage" className="inline-flex justify-center">
            <SchoolLogo size="lg" />
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 font-semibold">Portal Login</p>
        </div>

        <Card className="glass-card border-0 shadow-2xl rounded-3xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-sky-500 to-amber-400" />
          <CardHeader className="text-center pt-8">
            <CardTitle className="font-display text-2xl text-slate-800 dark:text-white">Welcome Back!</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@example.com"
                  className="mt-1.5"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email")}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-500 mt-1" role="alert">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="pr-10"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 text-slate-500"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-500 mt-1" role="alert">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" variant="default" className="w-full gap-2 h-12" disabled={isLoading}>
                <LogIn className="h-4 w-4" />
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
              <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                ← Back to website
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}
