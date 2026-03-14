"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  FileCheck,
  FileText,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard/buyer", label: "Buyer Dashboard", icon: Landmark },
  { href: "/dashboard/supplier", label: "Supplier Dashboard", icon: Building2 },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/purchase-orders", label: "Purchase Orders", icon: FileCheck },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/onboarding/supplier", label: "Supplier Onboarding", icon: ShieldCheck },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/dashboard/buyer" className="text-lg font-semibold text-primary">
            TradeFlow Pro
          </Link>
          <form action="/logout" method="post">
            <Button variant="outline" size="sm" type="submit">
              Logout
            </Button>
          </form>
        </div>
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6 lg:hidden">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground",
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[250px_1fr] lg:px-8">
        <aside className="hidden h-fit rounded-xl border bg-background p-3 lg:block">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 space-y-6">{children}</main>
      </div>
    </div>
  );
}
