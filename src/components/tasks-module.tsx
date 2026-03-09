"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export function TasksModule() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const remaining = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  function addTask() {
    const value = input.trim();
    if (!value) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: value,
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setInput("");
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.completed));
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tasks</h3>

        {completed > 0 && (
          <Button variant="ghost" size="sm" onClick={clearCompleted}>
            Clear done
          </Button>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-muted/30 flex flex-col items-center rounded-md border py-2">
          <span className="text-lg font-semibold">{total}</span>
          <span className="text-muted-foreground text-xs">Total</span>
        </div>

        <div className="bg-muted/30 flex flex-col items-center rounded-md border py-2">
          <span className="text-primary text-lg font-semibold">
            {completed}
          </span>
          <span className="text-muted-foreground text-xs">Done</span>
        </div>

        <div className="bg-muted/30 flex flex-col items-center rounded-md border py-2">
          <span className="text-lg font-semibold">{remaining}</span>
          <span className="text-muted-foreground text-xs">Left</span>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-muted h-1.5 w-full rounded">
        <div
          className="bg-primary h-full rounded transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
          placeholder="Add a task..."
          className="flex-1 rounded-md border px-3 py-2 text-sm"
        />

        <Button onClick={addTask} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Task List */}
      <ScrollArea className="h-full flex-1">
        <div className="flex flex-col gap-2 pr-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between gap-2"
            >
              <FieldLabel className="flex-1">
                <Field orientation="horizontal">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />

                  <FieldContent>
                    <FieldTitle
                      className={
                        task.completed
                          ? "text-muted-foreground line-through"
                          : ""
                      }
                    >
                      {task.title}
                    </FieldTitle>
                  </FieldContent>
                </Field>
              </FieldLabel>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="mb-2 h-6 w-6 opacity-40" />
              <p className="text-sm">No tasks yet</p>
              <p className="text-xs">Add one above to get started</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
