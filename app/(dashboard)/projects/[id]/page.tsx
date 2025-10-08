"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MoreHorizontal, Calendar, User, GripVertical, Columns } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { IProject } from "@/models/project.model";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ITicket } from "@/models/ticket.model";
import mongoose from "mongoose";

interface KanbanColumn {
  id: string;
  title: string;
  tasks: ITicket[];
}

export default function ProjectOverview() {
  const params = useParams();
  const projectId = params?.id;

  const [projectData, setProjectData] = useState<IProject | null>(null);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userDescription, setUserDescription] = useState("");
  const [isTicketButtonLoading, setIsTicketButtonLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<ITicket | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = active.data.current?.task;
    if (task) {
      setActiveTask(task);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task and its column
    const activeColumn = columns.find((col) => col.tasks.some((task) => task.id === activeId));
    const activeTask = activeColumn?.tasks.find((task) => task.id === activeId);

    if (!activeColumn || !activeTask) return;

    // Find the over column
    const overColumn = columns.find((col) => col.id === overId || col.tasks.some((task) => task.id === overId));

    if (!overColumn) return;

    // If we're moving to a different column
    if (activeColumn.id !== overColumn.id) {
      setColumns((prevColumns) => {
        const activeColumnIndex = prevColumns.findIndex((col) => col.id === activeColumn.id);
        const overColumnIndex = prevColumns.findIndex((col) => col.id === overColumn.id);

        const newActiveColumn = {
          ...prevColumns[activeColumnIndex],
          tasks: prevColumns[activeColumnIndex].tasks.filter((task) => task.id !== activeId),
        };

        const overTaskIndex = overColumn.tasks.findIndex((task) => task.id === overId);
        const insertIndex = overTaskIndex >= 0 ? overTaskIndex : overColumn.tasks.length;

        const newOverColumn = {
          ...prevColumns[overColumnIndex],
          tasks: [...prevColumns[overColumnIndex].tasks.slice(0, insertIndex), activeTask, ...prevColumns[overColumnIndex].tasks.slice(insertIndex)],
        };

        const newColumns = [...prevColumns];
        newColumns[activeColumnIndex] = newActiveColumn;
        newColumns[overColumnIndex] = newOverColumn;

        return newColumns;
      });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task and its column
    const activeColumn = columns.find((col) => col.tasks.some((task) => task.id === activeId));
    const activeTask = activeColumn?.tasks.find((task) => task.id === activeId);

    if (!activeColumn || !activeTask) return;

    // Find the over column
    const overColumn = columns.find((col) => col.id === overId || col.tasks.some((task) => task.id === overId));

    if (!overColumn) return;

    // If moving within the same column
    if (activeColumn.id === overColumn.id) {
      const oldIndex = activeColumn.tasks.findIndex((task) => task.id === activeId);
      const newIndex = activeColumn.tasks.findIndex((task) => task.id === overId);

      if (oldIndex !== newIndex) {
        setColumns((prevColumns) =>
          prevColumns.map((col) => {
            if (col.id === activeColumn.id) {
              return {
                ...col,
                tasks: arrayMove(col.tasks, oldIndex, newIndex >= 0 ? newIndex : col.tasks.length - 1),
              };
            }
            return col;
          })
        );
      }
    }
    // Cross-column movement is already handled in handleDragOver
  }

  const handleDataLoading = async () => {
    console.log("inside handle data loading");
    try {
      const response = await axios.get(`/api/projects/details/${projectId}`);
      console.log("response:", response);

      if (response.data.success) {
        setProjectData(response.data.project);
        setColumns(response.data.tickets || []);
      }
    } catch (error) {
      toast.error("Failed to fetch project information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTicketCreation = async () => {
    if (!userDescription.trim()) {
      toast.error("Please enter a ticket description");
      return;
    }

    setIsTicketButtonLoading(true);

    try {
      const response = await axios.post("/api/ticket/create", {
        description: userDescription,
        projectId: projectId,
      });

      console.log("project details:", response.data);

      if (response.data.success) {
        toast.success("Ticket created successfully");
        setUserDescription("");
        // Refresh the data to show the new ticket
        await handleDataLoading();
      }
    } catch (error) {
      toast.error("Failed to create new ticket");
    } finally {
      setIsTicketButtonLoading(false);
    }
  };

  function TaskCard({ task }: { task: ITicket }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: task.id,
      data: {
        type: "task",
        task,
      },
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const priorityColors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };

    const handleTicketStatusChanges = async (ticketId: mongoose.Types.ObjectId) => {
      // Find the column containing the ticket
      const newColumns = columns.map((col) => ({ ...col, tasks: [...col.tasks] }));
      let fromColIdx = -1;
      let taskIdx = -1;
      let taskToMove: ITicket | null = null;

      // Find the column and task index
      for (let i = 0; i < newColumns.length; i++) {
        const idx = newColumns[i].tasks.findIndex((t) => t._id?.toString() === ticketId.toString());
        if (idx !== -1) {
          fromColIdx = i;
          taskIdx = idx;
          taskToMove = newColumns[i].tasks[idx];
          break;
        }
      }

      if (fromColIdx === -1 || !taskToMove) {
        toast.error("Ticket not found in any column");
        return;
      }

      // Determine the next status
      let nextStatus: "INPROGRESS" | "INTESTING" | "COMPLETED";
      if (taskToMove.status === "INPROGRESS") {
        nextStatus = "INTESTING";
      } else if (taskToMove.status === "INTESTING") {
        nextStatus = "COMPLETED";
      } else {
        nextStatus = "INPROGRESS";
      }

      try {
        // Update the ticket status in the backend first
        const response = await axios.post("/api/ticket/status", {
          ticket_id: ticketId,
          new_status: nextStatus,
        });

        if (response.data && response.data.success) {
          // Remove from current column
          newColumns[fromColIdx].tasks.splice(taskIdx, 1);

          // Find the target column
          const toColIdx = newColumns.findIndex((col) => col.id === nextStatus);
          if (toColIdx === -1) {
            toast.error("Target column not found");
            return;
          }

          // Update the task's status and push to the new column
          const updatedTask: any = { ...taskToMove, status: nextStatus };
          newColumns[toColIdx].tasks.push(updatedTask);

          setColumns(newColumns);
          toast.success("Ticket moved successfully");

          // Refresh the data to ensure UI is in sync with backend
          await handleDataLoading();
        } else {
          toast.error("Failed to move ticket");
        }
      } catch (error) {
        toast.error("Failed to move ticket");
      }
    };

    return (
      <Card ref={setNodeRef} style={style} className={`mb-3 cursor-pointer hover:shadow-md transition-shadow ${isDragging ? "opacity-50" : ""}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded">
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
                <DropdownMenuItem
                  onClick={() => {
                    handleTicketStatusChanges(task._id);
                  }}
                >
                  Move to {task.status === "INPROGRESS" ? "Testing" : task.status === "INTESTING" ? "Completed" : "Progress"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="text-xs ml-8">{task.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between ml-8">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">{task.developer?.name || "Unassigned"}</span>
              </div>
              <Badge variant="secondary" className={`text-xs ${priorityColors[task?.priority as keyof typeof priorityColors]}`}>
                {task.priority}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  function KanbanColumn({ column }: { column: KanbanColumn }) {
    const { setNodeRef } = useDroppable({
      id: column.id,
      data: {
        type: "column",
        column,
      },
    });

    return (
      <div className="flex-1 min-w-80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-sm">{column.title}</h3>
            <Badge variant="secondary" className="text-xs">
              {column.tasks.length}
            </Badge>
          </div>
        </div>
        <div ref={setNodeRef} className="space-y-2 min-h-[200px] p-2 rounded-lg border-2 border-dashed border-transparent transition-colors">
          <SortableContext items={column.tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>
      </div>
    );
  }

  useEffect(() => {
    handleDataLoading();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-muted-foreground text-sm">Loading project details...</span>
        </div>
      ) : (
        <div className="container mx-auto p-6 space-y-8">
          {/* Project Header */}
          {projectData && (
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
                        <span className="text-sm text-muted-foreground">{projectData.manager?.name || "Not assigned"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tech Lead */}
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Tech Lead</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-muted-foreground">{projectData.techlead?.name || "Not assigned"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Timeline</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {projectData.start_date ? new Date(projectData.start_date).toLocaleDateString() : "Not set"} -{" "}
                        {projectData.finish_date ? new Date(projectData.finish_date).toLocaleDateString() : "Not finished"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Kanban Board */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Project Board</CardTitle>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="sm">
                      New Ticket
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Create New Ticket</DrawerTitle>
                      <DrawerDescription>Fill in the details below to create a new ticket for this project.</DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 py-2 space-y-4">
                      <Label htmlFor="ticket-desc" className="block text-sm font-medium">
                        Ticket Description
                      </Label>
                      <Textarea
                        id="ticket-desc"
                        placeholder="Enter ticket description"
                        rows={4}
                        className="resize-none"
                        value={userDescription}
                        onChange={(e) => setUserDescription(e.target.value)}
                      />
                    </div>
                    <DrawerFooter>
                      <div className="flex flex-row gap-2 justify-end">
                        <Button onClick={handleTicketCreation} type="button" disabled={isTicketButtonLoading}>
                          {isTicketButtonLoading ? "Creating..." : "Create Ticket"}
                        </Button>
                        <DrawerClose asChild>
                          <Button variant="outline" type="button">
                            Cancel
                          </Button>
                        </DrawerClose>
                      </div>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
              <CardDescription>Track progress across different stages of development</CardDescription>
            </CardHeader>
            <CardContent>
              {columns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground mb-2">No tickets found for this project</p>
                  <p className="text-sm text-muted-foreground">Create your first ticket to get started</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex space-x-6 overflow-x-auto pb-4">
                    {columns.map((column) => (
                      <KanbanColumn key={column.id} column={column} />
                    ))}
                  </div>
                  <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
                </DndContext>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
