"use client";

import { format } from "date-fns";
import { Calendar, Tag, Circle, CircleCheck, CircleDashed } from "lucide-react";
import type { Task } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

const statusConfig = {
    "To Do": {
        icon: <CircleDashed className="h-4 w-4" />,
        badgeVariant: "secondary" as const,
        className: ""
    },
    "In Progress": {
        icon: <Circle className="h-4 w-4" />,
        badgeVariant: "default" as const,
        className: ""
    },
    "Done": {
        icon: <CircleCheck className="h-4 w-4" />,
        badgeVariant: "outline" as const,
        className: "text-accent-foreground border-accent bg-accent/20"
    }
}


export function TaskCard({ task }: TaskCardProps) {
  const { icon, badgeVariant, className } = statusConfig[task.status];
  const isOverdue = !['Done'].includes(task.status) && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));

  return (
    <Card className={cn("transition-all hover:shadow-md", isOverdue && "border-destructive/50 bg-destructive/5")}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-medium leading-tight pr-4">{task.description}</CardTitle>
            <Badge variant={badgeVariant} className={cn("flex-shrink-0", className)}>
                {icon}
                <span className="ml-2">{task.status}</span>
            </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>{task.category}</span>
          </div>
          <div className={cn("flex items-center gap-2", isOverdue && "text-destructive font-medium")}>
            <Calendar className="h-4 w-4" />
            <span>{format(task.dueDate, "MMM d, yyyy")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
