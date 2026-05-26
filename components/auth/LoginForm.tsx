"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Loader2, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface FloatingFieldProps {
  id: string;
  label: string;
  type?: string;
  icon: React.ReactNode;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  rightElement?: React.ReactNode;
}

function AuthField({
  id,
  label,
  type = "text",
  icon,
  error,
  value,
  onChange,
  onBlur,
  rightElement,
}: FloatingFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoComplete={type === "password" ? "current-password" : "email"}
          className={cn(
            "h-12 w-full rounded-xl border bg-white/10 pl-11 text-sm text-white outline-none transition-all",
            "placeholder:text-slate-500",
            rightElement ? "pr-12" : "pr-4",
            error
              ? "border-rose-400/50 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20"
              : "border-white/15 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          )}
          placeholder={
            type === "password" ? "Enter your password" : "name@example.com"
          }
        />
        {rightElement && (
          <div className="absolute right-2 top-1/2 z-10 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-300">{error}</p>}
    </div>
  );
}

export function LoginForm() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setApiError(null);
    setSubmitting(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ??
        (error as Error).message ??
        "Invalid credentials";
      setApiError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Animated blobs */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full blur-[120px]"
        style={{
          background: "rgba(99,102,241,0.3)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-[500px] w-[500px] rounded-full blur-[100px]"
        style={{
          background: "rgba(139,92,246,0.25)",
          animation: "float 10s ease-in-out infinite reverse",
        }}
      />
      <div
        className="pointer-events-none absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full blur-[80px]"
        style={{
          background: "rgba(79,70,229,0.2)",
          animation: "float 12s ease-in-out infinite 2s",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px] rounded-3xl border border-white/10 p-12 shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="text-center">
            <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  animation: "pulse-ring 2s ease-out infinite",
                  border: "2px solid rgba(129,140,248,0.4)",
                }}
              />
              <div
                className="relative flex h-16 w-16 items-center justify-center rounded-full font-heading text-xl font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                }}
              >
                SC
              </div>
            </div>
            <p
              className="font-heading text-sm font-semibold tracking-[0.15em] text-indigo-200/90"
              style={{ letterSpacing: "0.15em" }}
            >
              SCHOOL CONNECT
            </p>
            <div className="mx-auto my-4 h-px w-16 bg-white/10" />
            <h1 className="font-heading text-[28px] font-bold text-white">
              Welcome Back
            </h1>
            <p className="mt-1 text-sm text-slate-400">Sign in to continue</p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <motion.div variants={itemVariants}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <AuthField
                    id="email"
                    label="Email address"
                    type="email"
                    icon={<Mail className="h-5 w-5" />}
                    error={errors.email?.message}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <AuthField
                    id="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    icon={<Lock className="h-5 w-5" />}
                    error={errors.password?.message}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />
                )}
              />
            </motion.div>

            {apiError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/15 px-4 py-3 text-sm text-red-200"
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{apiError}</span>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  "flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] font-heading text-[15px] font-semibold text-white transition-all",
                  "hover:-translate-y-px hover:brightness-110 active:scale-[0.98]",
                  "disabled:cursor-not-allowed disabled:opacity-70"
                )}
                style={{
                  background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                  boxShadow: "0 8px 24px rgba(79,70,229,0.5)",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>

      <p className="relative z-10 mt-8 text-center text-xs text-slate-500">
        School Connect © 2025
      </p>
    </div>
  );
}
