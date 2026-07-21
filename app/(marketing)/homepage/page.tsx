import Link from "next/link";
import {
  CheckCircle2,
  BarChart3,
  Target,
  Moon,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  Clock,
  MoreHorizontal,
  Plus,
  Users,
  Star,
  Layers,
  Shield,
  Check,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground selection:bg-primary/20">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none absolute -left-30 top-0 h-96 w-96 rounded-full bg-primary/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-30 top-1/3 h-96 w-96 rounded-full bg-green-500/10 blur-[100px]" />

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* 1. Hero Section */}
        <section className="mx-auto max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 backdrop-blur-md">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold tracking-wide text-foreground/90 uppercase">
              Next-Gen Productivity Platform
            </span>
          </div>

          <h1 className="mb-6 text-4xl md:text-5xl font-bold lg:leading-[1.15]">
            Organize Your Day, <br className="hidden sm:inline" />
            <span className="text-primary">Master Your Workflow</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Taskflow Pro is built for ambitious professionals and high-performing teams. Streamline your tasks, eliminate clutter, and track real progress in real time.
          </p>

          <div className="flex justify-center">
            <Link
              href="/signup"
              className="gradient-brand group flex items-center justify-center gap-2.5 rounded-lg px-9 py-4 text-base font-semibold text-primary-foreground shadow-lg animate__animated animate__tada animate__slow animate__infinite transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/35 active:translate-y-0"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

         {/* 3. Social Proof & Metrics Bar */}
        {/* <section className="mt-20 border-y border-border/40 bg-muted/10 py-12">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-2 flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-2xl font-extrabold text-foreground sm:text-3xl">4.9 / 5.0</p>
              <p className="text-xs font-medium text-muted-foreground">Over 2,000+ reviews</p>
            </div>

            <div className="flex flex-col items-center justify-center border-l border-border/40">
              <div className="mb-2 rounded-lg bg-primary/10 p-2 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-foreground sm:text-3xl">50,000+</p>
              <p className="text-xs font-medium text-muted-foreground">Active daily users</p>
            </div>

            <div className="flex flex-col items-center justify-center border-l border-border/40">
              <div className="mb-2 rounded-lg bg-pink-500/10 p-2 text-pink-500">
                <Layers className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-foreground sm:text-3xl">1.2M+</p>
              <p className="text-xs font-medium text-muted-foreground">Tasks completed monthly</p>
            </div>

            <div className="flex flex-col items-center justify-center border-l border-border/40">
              <div className="mb-2 rounded-lg bg-green-500/10 p-2 text-green-500">
                <Shield className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-foreground sm:text-3xl">99.99%</p>
              <p className="text-xs font-medium text-muted-foreground">Uptime SLA guarantee</p>
            </div>
          </div>
        </section> */}
       

        {/* 4. Features Section */}
        <section className="mt-16 py-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground sm:text-3xl">
              Why Choose <span className="text-primary">Taskflow Pro?</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Everything you need to transform daily chaos into effortless output.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-md">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mb-2.5 text-lg font-bold text-foreground">
                Intelligent Task Management
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Structure your routines, schedule deadlines, and prioritize key action items effortlessly.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-md">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 text-pink-500 transition-colors group-hover:bg-pink-500 group-hover:text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mb-2.5 text-lg font-bold text-foreground">
                Pro Performance Insights
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Gain deep clarity into your output with completion stats, task Velocity metric charts, and trends.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-md sm:col-span-2 lg:col-span-1">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-500 transition-colors group-hover:bg-purple-500 group-hover:text-white">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mb-2.5 text-lg font-bold text-foreground">
                Distraction-Free Focus
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Filter out low-priority noise and focus strictly on high-impact goals with customized views.
              </p>
            </div>
          </div>
        </section>

         {/* 6. Bottom High-Converting CTA Banner */}
        {/* <section className="mt-24 sm:mt-32">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 via-background to-background p-8 text-center shadow-2xl sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-[90px]" />

            <div className="mx-auto max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Zap className="h-3.5 w-3.5" /> No Credit Card Required
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Ready to Master Your Workflow?
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                Join over 50,000 high-performing professionals who save an average of 6 hours every week using Taskflow Pro.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="gradient-brand group flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/demo"
                  className="flex w-full items-center justify-center rounded-xl border border-border/80 bg-background/60 px-8 py-3.5 text-base font-semibold text-foreground backdrop-blur-md transition-colors hover:bg-muted/60 sm:w-auto"
                >
                  Request a Demo
                </Link>
              </div>
            </div>
          </div>
        </section> */}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/10 py-8 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Taskflow Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}