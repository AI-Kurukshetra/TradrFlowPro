import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create Account</h1>
        <p className="text-sm text-muted-foreground">Start your TradeFlow Pro workspace</p>
      </div>
      <SignupForm />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
