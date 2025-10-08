"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Brain, Loader2, AlertCircle } from "lucide-react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", login: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors = { email: "", password: "", login: "" };
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({ email: "", password: "", login: "" });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await signIn("credentials", {
        email: email.trim(),
        password: password.trim(),
        redirect: false,
      });

      if (response?.error) {
        console.error("Login error:", response.error);
        let errorMessage = "Login failed. Please try again.";

        // Handle specific error messages
        if (response.error === "CredentialsSignin") {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (response.error === "Configuration") {
          errorMessage = "There was a problem with the authentication configuration.";
        } else if (response.error === "AccessDenied") {
          errorMessage = "Access denied. Please contact support.";
        } else if (response.error.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (response.error.length > 0) {
          errorMessage = response.error;
        }

        setErrors((prev) => ({ ...prev, login: errorMessage }));
      } else {
        router.replace("/projects");
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      setErrors((prev) => ({
        ...prev,
        login: "An unexpected error occurred. Please try again later.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary">Taskmind-AI</h1>
                  <p className="text-xs text-muted-foreground">Intelligent Task Management</p>
                </div>
              </div>
            </div>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your Taskmind-AI account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {errors.login && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.login}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                  className={errors.email ? "border-destructive" : ""}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline underline-offset-4">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }
                  }}
                  className={errors.password ? "border-destructive" : ""}
                  disabled={isLoading}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline underline-offset-4">
                Create account
              </Link>
            </div>
          </CardContent>
        </Card>
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline underline-offset-4"
          >
            <span>←</span> Go back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
