"use client";

import { useState } from "react";
import type { Task } from "@/lib/types";
import { TaskForm } from "@/components/task-form";
import { TaskList } from "@/components/task-list";
import { ListChecks } from "lucide-react";

const initialTasks: Task[] = [
  {
    id: "1",
    description: "Design the new landing page",
    status: "In Progress",
    category: "Work",
    dueDate: new Date(),
  },
  {
    id: "2",
    description: "Buy groceries for the week",
    status: "To Do",
    category: "Shopping",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  },
  {
    id: "3",
    description: "Finalize Q3 report",
    status: "Done",
    category: "Work",
    dueDate: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
    {
    id: "4",
    description: "Call the dentist for an appointment",
    status: "To Do",
    category: "Personal",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleAddTask = (task: Omit<Task, "id">) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div className="min-h-screen w-full bg-background font-body">
      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <header className="mb-8 md:mb-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <ListChecks className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
              Taskify
            </h1>
          </div>
          <p className="mt-2 text-lg text-muted-foreground">
            A clean and simple way to manage your daily tasks.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <aside className="lg:col-span-1">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Add New Task</h2>
              <TaskForm addTask={handleAddTask} />
            </div>
          </aside>
          <div className="lg:col-span-2">
            <TaskList tasks={tasks} />
          </div>
        </div>
      </main>
    </div>
  );
}
