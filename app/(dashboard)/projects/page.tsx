"use client";

import axios from "axios";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IProject } from "@/models/project.model";

export default function DashboardPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getStatusVariant = (status?: IProject["status"]) => {
    switch (status) {
      case "INPROGRESS":
        return "default" as const;
      case "PLANNING":
        return "secondary" as const;
      case "COMPLETED":
        return "outline" as const;
      case "ONHOLD":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  const getStatusLabel = (status?: IProject["status"]) => {
    switch (status) {
      case "INPROGRESS":
        return "In Progress";
      case "PLANNING":
        return "Planning";
      case "COMPLETED":
        return "Completed";
      case "ONHOLD":
        return "On Hold";
      default:
        return "Unknown";
    }
  };

  const handlePageLoading = async () => {
    try {
      const response = await axios.get("/api/projects");
      if (response.data?.success) {
        setProjects(response.data.projects || []);
      } else {
        toast.error("Failed to load projects");
      }
    } catch (err: any) {
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handlePageLoading();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects Overview</h1>
          <p className="text-muted-foreground">Manage and monitor all ongoing projects</p>
        </div>
        <Button onClick={() => router.push("/projects/create")}>Add Project</Button>
      </div>

      {/* Summary Stats */}
      <div className="my-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{projects.length || 0}</div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{projects?.filter((p) => p.status === "PLANNING").length || 0}</div>
                <div className="text-sm text-muted-foreground">In Planning</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {projects?.filter((p) => p.status === "COMPLETED").length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {projects?.reduce((sum, project) => sum + (project.contributors?.length || 0), 0) || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Developers</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="w-full mt-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border border-border/60">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-3 w-56 mt-2" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="pt-2 border-t border-border/40">
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Array.from({ length: 4 }).map((__, j) => (
                          <Skeleton key={j} className="h-5 w-16 rounded" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card
                key={(project as any)._id as any}
                className="group cursor-pointer border border-border/60 hover:border-primary shadow-sm hover:shadow-lg transition-all duration-200"
                onClick={() => router.push(`/projects/${(project as any)._id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold truncate">{project.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                    </div>
                    <Badge variant={getStatusVariant(project.status)} className="ml-2 text-xs px-2 py-1 rounded">
                      {getStatusLabel(project.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <div className="flex flex-col gap-3">
                    {/* Team Info */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <span className="text-muted-foreground">Manager:</span>
                        <span className="font-medium truncate">{(project as any).manager || "Unassigned"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <User className="h-4 w-4 text-blue-500" />
                        <span className="text-muted-foreground">Tech Lead:</span>
                        <span className="font-medium truncate">{(project as any).techlead || "Unassigned"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-muted-foreground">Developers:</span>
                        <span className="font-medium">{project.contributors?.length || 0}</span>
                      </div>
                    </div>
                    {/* Tech Stack */}
                    <div className="pt-2 border-t border-border/40">
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.techstack?.length > 0 ? (
                          project.techstack.slice(0, 6).map((tech, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5 rounded">
                              {tech}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No tech stack listed</span>
                        )}
                        {project.techstack?.length > 6 && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5 rounded">
                            +{project.techstack.length - 6}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-6">
              <svg
                className="h-20 w-20 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 48 48"
              >
                <rect x="8" y="12" width="32" height="24" rx="4" className="stroke-2" />
                <path d="M16 20h16M16 28h8" className="stroke-2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-muted-foreground mb-2">No Projects Found</h2>
            <p className="text-base text-muted-foreground mb-6 text-center max-w-md">
              You haven't created any projects yet. Click below to start your first project and get your team working
              together!
            </p>
            <Button
              asChild
              className="px-6 py-2 text-base font-semibold rounded-md shadow bg-primary text-primary-foreground hover:bg-primary/90 transition"
            >
              <a href="/projects/create">
                <span className="mr-2 text-lg">+</span> Create Project
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
