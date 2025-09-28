"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, MoreHorizontal, Calendar, User, GripVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: {
    name: string;
    avatar?: string;
  };
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  tasks: Task[];
}

// Mock data - replace with actual data fetching
const projectData = {
  id: "1",
  title: "E-commerce Platform Redesign",
  description:
    "Complete redesign of the customer-facing e-commerce platform with modern UI/UX, improved performance, and mobile-first approach.",
  manager: {
    name: "Sarah Johnson",
    avatar: "/avatars/sarah.jpg",
  },
  techLead: {
    name: "Alex Chen",
    avatar: "/avatars/alex.jpg",
  },
  status: "In Progress",
  startDate: "2024-01-15",
  endDate: "2024-06-30",
};

const kanbanData: KanbanColumn[] = [
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: "1",
        title: "User Authentication System",
        description: "Implement OAuth2 and JWT authentication",
        assignee: { name: "John Doe", avatar: "/avatars/john.jpg" },
        priority: "high",
        dueDate: "2024-02-15",
      },
      {
        id: "2",
        title: "Product Catalog API",
        description: "Design and implement REST API for product management",
        assignee: { name: "Jane Smith", avatar: "/avatars/jane.jpg" },
        priority: "medium",
        dueDate: "2024-02-20",
      },
    ],
  },
  {
    id: "in-testing",
    title: "In Testing",
    tasks: [
      {
        id: "3",
        title: "Payment Gateway Integration",
        description: "Integrate Stripe payment processing",
        assignee: { name: "Mike Wilson", avatar: "/avatars/mike.jpg" },
        priority: "high",
        dueDate: "2024-02-10",
      },
      {
        id: "4",
        title: "Shopping Cart Functionality",
        description: "Add/remove items, quantity management",
        assignee: { name: "Lisa Brown", avatar: "/avatars/lisa.jpg" },
        priority: "medium",
      },
    ],
  },
  {
    id: "completed",
    title: "Completed",
    tasks: [
      {
        id: "5",
        title: "Database Schema Design",
        description: "Design and implement PostgreSQL schema",
        assignee: { name: "Tom Davis", avatar: "/avatars/tom.jpg" },
        priority: "high",
      },
      {
        id: "6",
        title: "UI Component Library",
        description: "Create reusable React components",
        assignee: { name: "Emma Garcia", avatar: "/avatars/emma.jpg" },
        priority: "medium",
      },
      {
        id: "7",
        title: "Project Setup & Configuration",
        description: "Initialize project structure and development environment",
        assignee: { name: "Alex Chen", avatar: "/avatars/alex.jpg" },
        priority: "low",
      },
    ],
  },
];

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`mb-3 cursor-pointer hover:shadow-md transition-shadow ${isDragging ? "opacity-50" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
            >
              <GripVertical className="h-3 w-3 text-gray-400" />
            </div>
            <CardTitle className="text-sm font-medium leading-tight flex-1">{task.title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
              <DropdownMenuItem>Move to...</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-xs ml-8">{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between ml-8">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatar} />
              <AvatarFallback className="text-xs">
                {task.assignee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Badge variant="secondary" className={`text-xs ${priorityColors[task.priority]}`}>
              {task.priority}
            </Badge>
          </div>
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function KanbanColumn({
  column,
  onTaskMove,
}: {
  column: KanbanColumn;
  onTaskMove: (taskId: string, newColumnId: string) => void;
}) {
  return (
    <div className="flex-1 min-w-80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-sm">{column.title}</h3>
          <Badge variant="secondary" className="text-xs">
            {column.tasks.length}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <SortableContext items={column.tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[200px]">
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function ProjectOverview() {
  const [columns, setColumns] = useState<KanbanColumn[]>(kanbanData);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the source column and task
    const sourceColumn = columns.find((col) => col.tasks.some((task) => task.id === activeId));

    if (!sourceColumn) return;

    const sourceTask = sourceColumn.tasks.find((task) => task.id === activeId);
    if (!sourceTask) return;

    // Find the target column
    const targetColumn = columns.find((col) => col.tasks.some((task) => task.id === overId) || col.id === overId);

    if (!targetColumn) return;

    // If moving within the same column
    if (sourceColumn.id === targetColumn.id) {
      const oldIndex = sourceColumn.tasks.findIndex((task) => task.id === activeId);
      const newIndex = sourceColumn.tasks.findIndex((task) => task.id === overId);

      if (oldIndex !== newIndex) {
        setColumns(
          columns.map((col) => {
            if (col.id === sourceColumn.id) {
              return {
                ...col,
                tasks: arrayMove(col.tasks, oldIndex, newIndex),
              };
            }
            return col;
          })
        );
      }
    } else {
      // Moving between columns
      setColumns(
        columns.map((col) => {
          if (col.id === sourceColumn.id) {
            return {
              ...col,
              tasks: col.tasks.filter((task) => task.id !== activeId),
            };
          }
          if (col.id === targetColumn.id) {
            const targetIndex = col.tasks.findIndex((task) => task.id === overId);
            const newTasks = [...col.tasks];
            newTasks.splice(targetIndex >= 0 ? targetIndex : newTasks.length, 0, sourceTask);
            return {
              ...col,
              tasks: newTasks,
            };
          }
          return col;
        })
      );
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Project Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{projectData.title}</CardTitle>
              <CardDescription className="text-base max-w-2xl">{projectData.description}</CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {projectData.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Manager */}
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Project Manager</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={projectData.manager.avatar} />
                    <AvatarFallback className="text-xs">
                      {projectData.manager.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{projectData.manager.name}</span>
                </div>
              </div>
            </div>

            {/* Tech Lead */}
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Tech Lead</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={projectData.techLead.avatar} />
                    <AvatarFallback className="text-xs">
                      {projectData.techLead.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{projectData.techLead.name}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Timeline</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(projectData.startDate).toLocaleDateString()} -{" "}
                  {new Date(projectData.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Project Board</CardTitle>
          <CardDescription>Track progress across different stages of development</CardDescription>
        </CardHeader>
        <CardContent>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  onTaskMove={(taskId, newColumnId) => {
                    // This function is kept for potential future use
                    console.log(`Move task ${taskId} to column ${newColumnId}`);
                  }}
                />
              ))}
            </div>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}
