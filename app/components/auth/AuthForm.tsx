"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/app/lib/auth-client";
import { Eye, EyeOff } from "lucide-react";

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
    <div className="glass w-full max-w-md rounded-[var(--radius)] p-8 py-10 shadow-2xl">
      <h1 className="mb-2 text-3xl font-bold gradient-text">
        {mode === "login" ? "Welcome back!" : "Create your account"}
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {mode === "login" ? "Log in to manage your tasks" : "Start organizing today"}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === "signup" && (
          <input
            className="rounded-lg border border-border bg-background px-4 py-2.5 outline-none focus:border-primary"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          className="rounded-lg border border-border bg-background px-4 py-2.5 outline-none focus:border-primary"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        {/* Password input wrapper with toggle button */}
        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-10 outline-none focus:border-primary"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-background hover:text-muted-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="gradient-brand mt-2 rounded-lg py-2.5 font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <button
        onClick={handleGoogle}
        className="w-full rounded-lg border border-border py-2.5 font-medium hover:bg-muted cursor-pointer"
      >
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>Don't have an account? <a href="/signup" className="font-semibold text-primary">Sign up</a></>
        ) : (
          <>Already have an account? <a href="/login" className="font-semibold text-primary">Log in</a></>
        )}
      </p>
    </div>
  );
}