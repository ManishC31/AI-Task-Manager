"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen text-foreground transition-colors duration-300 bg-background dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-4 border-b border-border bg-card">
        <h1 className="text-2xl font-bold">TaskMind AI</h1>
        <ModeToggle />
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 space-y-6 max-w-3xl mx-auto">
        <h2 className="text-5xl font-extrabold tracking-tight sm:text-6xl">Smart Project Management with AI</h2>
        <p className="text-lg text-muted-foreground max-w-xl">
          Revolutionize how you manage tasks. Assign developers, set priorities, and streamline projects with intelligent automation.
        </p>
        <Button size="lg" onClick={() => router.push("/login")}>
          Get Started
        </Button>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto pb-16">
        <Card className="hover:scale-105 transition-transform duration-300">
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <CheckCircle className="h-10 w-10 text-primary" />
            <h3 className="text-xl font-semibold">Smart Assignment</h3>
            <p className="text-muted-foreground">Our AI matches tasks with the best developers based on skills and availability.</p>
          </CardContent>
        </Card>
        <Card className="hover:scale-105 transition-transform duration-300">
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <CheckCircle className="h-10 w-10 text-primary" />
            <h3 className="text-xl font-semibold">Priority Management</h3>
            <p className="text-muted-foreground">Automatically prioritize tasks to ensure deadlines are met with ease.</p>
          </CardContent>
        </Card>
        <Card className="hover:scale-105 transition-transform duration-300">
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <CheckCircle className="h-10 w-10 text-primary" />
            <h3 className="text-xl font-semibold">Collaboration Tools</h3>
            <p className="text-muted-foreground">Collaborate in real-time with built-in reports, timelines, and analytics.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
