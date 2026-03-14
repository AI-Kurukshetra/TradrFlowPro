import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/40 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.10),transparent_35%)]" />
      <div className="relative w-full max-w-md space-y-4">
        <Link href="/" className="block text-center text-sm font-medium text-primary hover:underline">
          Back to Home
        </Link>
        {children}
      </div>
    </div>
  );
}
