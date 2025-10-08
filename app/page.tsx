"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, CheckCircle, BarChart3 } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";

export default function Home() {
  const { setTheme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            TaskMind AI
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/register">Sign Up</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-background to-muted/50">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Brain className="h-14 w-14 text-primary mb-6 drop-shadow-md" />
        </motion.div>
        <motion.h1
          className="text-4xl md:text-6xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          AI-Powered Task Management
        </motion.h1>
        <motion.p
          className="mt-4 max-w-2xl text-lg text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Streamline projects, boost productivity, and let AI handle the heavy lifting for your organization’s workflow.
        </motion.p>
        <motion.div
          className="mt-6 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button asChild size="lg" variant="default">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/demo">See Demo</Link>
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-background">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              icon: <CheckCircle className="h-10 w-10 text-primary" />,
              title: "Smart Task Assignment",
              desc: "AI suggests the right person for the right task, reducing bottlenecks.",
            },
            {
              icon: <BarChart3 className="h-10 w-10 text-primary" />,
              title: "Real-time Insights",
              desc: "Stay ahead with predictive analytics and progress dashboards.",
            },
            {
              icon: <Brain className="h-10 w-10 text-primary" />,
              title: "AI Productivity Boost",
              desc: "Let automation handle repetitive tasks so teams focus on strategy.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-sm border border-border bg-card hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center space-y-4">
                  {f.icon}
                  <h3 className="font-semibold text-xl">{f.title}</h3>
                  <p className="text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gradient-to-b from-muted/40 to-background">
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">Transform How Your Team Works</h2>
          <p className="text-muted-foreground">
            Get started today and see how AI can redefine task management for your organization.
          </p>
          <Button asChild size="lg">
            <Link href="/register">Start Free Trial</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
