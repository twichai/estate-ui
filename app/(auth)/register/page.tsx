import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Register() {
  return (
    <section className="h-screen bg-muted">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex w-full max-w-sm min-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md">
            <h1 className="text-xl font-semibold">Create an account</h1>
            <Input
              type="text"
              placeholder="Full name"
              className="text-sm"
              required
            />
            <Input
              type="email"
              placeholder="Email"
              className="text-sm"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              className="text-sm"
              required
            />
            <Input
              type="password"
              placeholder="Confirm password"
              className="text-sm"
              required
            />
            <Button type="submit" className="w-full">
              Register
            </Button>
          </div>
          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>Already have an account?</p>
            <a
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
