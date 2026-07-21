import AuthForm from "@/app/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />

      {/* Added: w-full and max-w-md */}
      <div className="relative z-10 w-full max-w-md md:max-w-4xl">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}