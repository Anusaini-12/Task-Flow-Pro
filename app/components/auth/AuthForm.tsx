"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/app/lib/auth-client";
import {
  Eye,
  EyeOff,
  Flower,
  Sparkles,
  User,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result =
      mode === "login"
        ? await signIn.email({ email, password })
        : await signUp.email({ email, password, name });

    setLoading(false);
    if (result.error) {
      setError(result.error.message || "Something went wrong");
    } else {
      router.push("/dashboard");
    }
  }

  async function handleGoogle() {
    await signIn.social({ provider: "google", callbackURL: "/dashboard" });
  }

  return (
    <div className="glass mx-auto flex w-full max-w-4xl overflow-hidden rounded-[var(--radius)] shadow-2xl border border-border">
      {/* LEFT SECTION: Modern/Classy Visual Panel (Hidden on Mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-border/40 bg-gradient-to-br from-primary/10 via-background to-muted/30 p-12 md:flex">
        {/* Subtle background decorative blurs */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

        {/* Faint watermark flower icon */}
        <Flower className="absolute -left-12 -bottom-12 h-96 w-96 text-primary/5 -rotate-12 pointer-events-none animate-[spin_12s_linear_infinite] transition-transform duration-1000 select-none" />

        {/* Top Brand Tag */}
        <div className="relative z-10 flex items-center gap-2 text-xs font-semibold tracking-wider text-foreground/80 uppercase">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span>Premium Experience</span>
        </div>

        {/* Center Content: Icon & Copy */}
        <div className="relative z-10">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-inner backdrop-blur-md">
            <Flower className="h-8 w-8 animate-[spin_12s_linear_infinite]" />
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Let your productivity <br />
            <span className="gradient-text font-extrabold">bloom naturally.</span>
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Experience a beautifully crafted workspace designed to bring clarity, elegance, and focus to your daily workflow.
          </p>
        </div>

        {/* Bottom Footer/Quote */}
        <div className="relative z-10 border-t border-border/40 pt-6">
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            &ldquo;Simplicity is the ultimate sophistication.&rdquo;
          </p>
        </div>
      </div>

      {/* RIGHT SECTION: Auth Form */}
      <div className="flex w-full flex-col justify-center p-8 sm:p-12 md:w-1/2">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="mb-1.5 text-3xl font-bold gradient-text">
            {mode === "login" ? "Welcome back!" : "Create account"}
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {mode === "login"
              ? "Log in to access your workspace"
              : "Start organizing your tasks today"}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground/80">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    className="w-full rounded-lg border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/80">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  className="w-full rounded-lg border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground/80">
                  Password
                </label>
                {mode === "login" && (
                  <a
                    href="#"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg border border-border bg-background/50 pl-10 pr-10 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-danger/10 border border-danger/20 p-3 text-xs text-danger font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="gradient-brand mt-1 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-[1.01] hover:shadow-primary/20 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Log In"
                : "Sign Up"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              OR
            </span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <button
            onClick={handleGoogle}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-background/50 py-2.5 text-sm font-medium transition-all hover:bg-muted/80 hover:border-border/80 cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="font-semibold text-primary hover:underline transition-all"
                >
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-semibold text-primary hover:underline transition-all"
                >
                  Log in
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}