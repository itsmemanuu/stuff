"use client";

import { useMemo } from "react";
import type { Task, TaskStatus } from "@/lib/types";
import { TaskCard } from "./task-card";
import { ClipboardList } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
}

const statusOrder: TaskStatus[] = ["To Do", "In Progress", "Done"];

export function TaskList({ tasks }: TaskListProps) {
  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      "To Do": [],
      "In Progress": [],
      Done: [],
    };

    tasks.forEach((task) => {
      groups[task.status].push(task);
    });

    // Sort tasks within each group by due date
    for (const status in groups) {
      groups[status as TaskStatus].sort(
        (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
      );
    }

    return groups;
  }, [tasks]);

  return (
    <div className="space-y-8">
      {statusOrder.map((status) => (
        <div key={status}>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-primary/20 text-card-foreground">{status}</h2>
          {groupedTasks[status].length > 0 ? (
            <div className="space-y-4">
              {groupedTasks[status].map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
                <ClipboardList className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium text-muted-foreground">
                    No tasks in this section.
                </p>
                <p className="text-sm text-muted-foreground">
                    {status === 'Done' ? 'Great job!' : 'Add a task to get started!'}
                </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
