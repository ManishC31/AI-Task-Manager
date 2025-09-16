"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({ name: "", email: "", password: "", confirmpassword: "", register: "" });
  const router = useRouter();

  console.log("error:", error);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    setError({ name: "", email: "", password: "", confirmpassword: "", register: "" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasErrors = false;

    if (!email || !emailRegex.test(email)) {
      setError((prev) => ({ ...prev, email: "Invalid email address" }));
      hasErrors = true;
    }

    if (!name) {
      setError((prev) => ({ ...prev, name: "Invalid name" }));
      hasErrors = true;
    }

    // Simple email format validation
    if (!password || password.length < 8) {
      setError((prev) => ({ ...prev, password: "Password should be of atleast 8 characters" }));
      hasErrors = true;
    }

    if (password !== confirmPassword) {
      setError((prev) => ({ ...prev, confirmpassword: "Password & confirm password are not matching" }));
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError((prev) => ({ ...prev, register: "Failed to register user" }));
    } else {
      router.replace("/login");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 dark:bg-slate-900">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Create New Account</CardTitle>
            <CardDescription>Enter details below to create new account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="text">Name</Label>
                  <Input id="text" type="Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                  {error?.name ? <p className="text-red-500 text-xs">{error?.name}</p> : null}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  {error?.email ? <p className="text-red-500 text-xs">{error?.email}</p> : null}{" "}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
                  {error?.password ? <p className="text-red-500 text-xs">{error?.password}</p> : null}{" "}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                  </div>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {error?.confirmpassword ? <p className="text-red-500 text-xs">{error?.confirmpassword}</p> : null}{" "}
                </div>
                {error?.register ? <p className="text-red-500 text-xs">{error?.register}</p> : null}
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;
