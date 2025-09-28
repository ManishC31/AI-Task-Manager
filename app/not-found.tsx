"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Card className="max-w-md text-center p-8 shadow-lg">
                <CardContent className="flex flex-col items-center space-y-6">
                    <AlertTriangle className="h-12 w-12 text-destructive" />
                    <h1 className="text-2xl font-bold tracking-tight">Page Not Found</h1>
                    <p className="text-muted-foreground">
                        The page you’re looking for doesn’t exist or has been moved.
                    </p>
                    <Button asChild>
                        <Link href="/">Go Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
