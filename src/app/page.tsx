import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const solutions = [
  {
    icon: Wallet,
    title: "Dynamic Supplier Financing",
    description: "Offer early payment options across supplier tiers with configurable discounts.",
  },
  {
    icon: FileCheck2,
    title: "Procure-to-Pay Automation",
    description: "Manage purchase orders, invoice approval, and settlement from one workflow.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance & KYC",
    description: "Collect KYC artifacts and maintain an audit-ready trail for each supplier.",
  },
];

const stats = [
  { label: "Monthly TPV", value: "$7.8M" },
  { label: "Active Suppliers", value: "146" },
  { label: "Approval Time", value: "3.8 Days" },
  { label: "On-time Settlement", value: "93.4%" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold tracking-tight">TradeFlow Pro</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
            <Link href="/#solutions" className="hover:text-foreground">Solutions</Link>
            <Link href="/#platform" className="hover:text-foreground">Platform</Link>
            <Link href="/#suppliers" className="hover:text-foreground">Suppliers</Link>
            <Link href="/#resources" className="hover:text-foreground">Resources</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 sm:px-4"
            >
              Request Demo
            </Link>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-4 overflow-x-auto px-4 pb-3 text-sm text-muted-foreground lg:hidden sm:px-6">
          <Link href="/#solutions" className="whitespace-nowrap">Solutions</Link>
          <Link href="/#platform" className="whitespace-nowrap">Platform</Link>
          <Link href="/#suppliers" className="whitespace-nowrap">Suppliers</Link>
          <Link href="/#resources" className="whitespace-nowrap">Resources</Link>
        </div>
      </header>

      <main>
        <section id="platform" className="border-b bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.14),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_35%)]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-8 lg:py-20">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.2em] text-primary">Supply Chain Finance Cloud</p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                Trade Finance Infrastructure Built For Modern Procurement Teams
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                Manage buyer-supplier liquidity with structured invoice workflows, flexible
                financing, and real-time portfolio analytics.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Start Pilot <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard/buyer"
                  className="inline-flex h-11 items-center rounded-md border border-input bg-background px-5 text-sm font-medium hover:bg-accent"
                >
                  View Live Platform
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border bg-background p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-medium">Treasury Control Snapshot</h2>
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-lg border bg-card p-3">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="mt-1 text-lg font-semibold sm:text-xl">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="solutions" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-2xl space-y-2">
            <h2 className="text-2xl font-semibold sm:text-3xl">Solutions For Buyers And Suppliers</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Launch financing programs that improve supplier cash flow while maintaining buyer control.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {solutions.map((item) => (
              <article key={item.title} className="rounded-xl border bg-background p-5 shadow-sm">
                <item.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="suppliers" className="border-y bg-background">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">Supplier Program Benefits</h2>
            <div className="mt-8 grid gap-3 text-sm md:grid-cols-2">
              <div className="flex items-start gap-2 rounded-lg border bg-muted/20 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>Faster access to working capital with transparent financing terms.</span>
              </div>
              <div className="flex items-start gap-2 rounded-lg border bg-muted/20 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>Digital onboarding and KYC to reduce time-to-activation.</span>
              </div>
              <div className="flex items-start gap-2 rounded-lg border bg-muted/20 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>Single pane of visibility across invoice approval and payment stages.</span>
              </div>
              <div className="flex items-start gap-2 rounded-lg border bg-muted/20 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>Built-in analytics for financing performance and settlement quality.</span>
              </div>
            </div>
          </div>
        </section>

        <section id="resources" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-2xl border bg-gradient-to-r from-primary/10 to-emerald-400/10 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Deploy TradeFlow Pro In Days, Not Months</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Built on Next.js App Router and Supabase for secure, scalable delivery across desktop,
              tablet, and mobile workflows.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="inline-flex h-10 items-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
              >
                Go To Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
