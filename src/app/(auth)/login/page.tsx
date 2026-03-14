import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectedFrom?: string };
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">Sign in to continue to TradeFlow Pro</p>
      </div>
      <LoginForm redirectedFrom={searchParams.redirectedFrom} />
      <p className="text-center text-sm text-muted-foreground">
        New to TradeFlow Pro?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
