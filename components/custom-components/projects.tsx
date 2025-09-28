"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User, Crown } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  name: string;
  description: string;
  manager: string;
  techLead: string;
  developerCount: number;
  status: "active" | "planning" | "completed" | "on-hold";
  technology: string[];
}

const projects: Project[] = [
  {
    id: "1",
    name: "E-Commerce Platform",
    description: "A modern e-commerce platform with real-time inventory management and AI-powered recommendations.",
    manager: "Sarah Johnson",
    techLead: "Alex Chen",
    developerCount: 8,
    status: "active",
    technology: ["React", "Node.js", "PostgreSQL", "Redis"],
  },
  {
    id: "2",
    name: "Mobile Banking App",
    description: "Secure mobile banking application with biometric authentication and real-time transactions.",
    manager: "Michael Rodriguez",
    techLead: "Emma Thompson",
    developerCount: 12,
    status: "active",
    technology: ["React Native", "Java", "MongoDB", "AWS"],
  },
  {
    id: "3",
    name: "Data Analytics Dashboard",
    description: "Business intelligence dashboard for real-time data visualization and reporting.",
    manager: "David Kim",
    techLead: "Lisa Wang",
    developerCount: 6,
    status: "planning",
    technology: ["Vue.js", "Python", "ClickHouse", "Docker"],
  },
  {
    id: "4",
    name: "IoT Device Management",
    description: "Platform for managing and monitoring IoT devices across multiple locations.",
    manager: "Jennifer Brown",
    techLead: "Robert Taylor",
    developerCount: 10,
    status: "active",
    technology: ["Angular", "Go", "InfluxDB", "Kubernetes"],
  },
  {
    id: "5",
    name: "HR Management System",
    description: "Comprehensive HR system for employee management, payroll, and performance tracking.",
    manager: "Thomas Wilson",
    techLead: "Maria Garcia",
    developerCount: 5,
    status: "completed",
    technology: ["React", "C#", "SQL Server", "Azure"],
  },
  {
    id: "6",
    name: "Video Streaming Service",
    description: "High-performance video streaming platform with content delivery optimization.",
    manager: "Amanda Davis",
    techLead: "James Anderson",
    developerCount: 15,
    status: "on-hold",
    technology: ["Next.js", "Rust", "Cassandra", "CDN"],
  },
];

const getStatusVariant = (status: Project["status"]) => {
  switch (status) {
    case "active":
      return "default";
    case "planning":
      return "secondary";
    case "completed":
      return "outline";
    case "on-hold":
      return "destructive";
    default:
      return "secondary";
  }
};

const Projects: React.FC = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects Overview</h1>
          <p className="text-muted-foreground">Manage and monitor all ongoing projects</p>
        </div>
        <Button onClick={() => router.push("/admin/projects/create")}>Add Project</Button>
      </div>

      {/* Summary Stats */}
      <div className="my-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{projects.filter((p) => p.status === "active").length}</div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{projects.filter((p) => p.status === "planning").length}</div>
            <div className="text-sm text-muted-foreground">In Planning</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{projects.filter((p) => p.status === "completed").length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {projects.reduce((sum, project) => sum + project.developerCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Developers</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="hover:shadow-lg transition-shadow duration-300"
            onClick={() => router.push(`/admin/projects/${project.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-xl font-semibold line-clamp-2">{project.name}</CardTitle>
                <Badge variant={getStatusVariant(project.status)} className="ml-2 capitalize">
                  {project.status.replace("-", " ")}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Team Information */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Crown className="h-4 w-4 mr-2" />
                    <span className="text-muted-foreground">Manager:</span>
                    <span className="ml-1 font-medium">{project.manager}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-muted-foreground">Tech Lead:</span>
                    <span className="ml-1 font-medium">{project.techLead}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-muted-foreground">Developers:</span>
                    <span className="ml-1 font-medium">{project.developerCount}</span>
                  </div>
                </div>

                {/* Technology Stack */}
                <div className="pt-2 border-t">
                  <div className="flex flex-wrap gap-1">
                    {project.technology.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Projects;
