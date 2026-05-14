import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, MoreHorizontal, GripVertical, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { toast } from "sonner";

// Column definitions
const columns = [
  {
    id: "todo",
    title: "To Do",
    color: "bg-gray-500",
    lightColor: "bg-gray-500/10 border-gray-500/20",
  },
  {
    id: "inprogress",
    title: "In Progress",
    color: "bg-blue-500",
    lightColor: "bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "done",
    title: "Done",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-500/10 border-emerald-500/20",
  },
];

const priorityConfig = {
  high: "bg-red-500/15 text-red-400 border-red-500/20",
  medium: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  low: "bg-gray-500/15 text-gray-400 border-gray-500/20",
};

// Initial tasks
const initialTasks: Task[] = [
  {
    _id: "t1",
    title: "Build authentication module",
    description: "JWT login, signup, refresh tokens",
    assignee: { _id: "u2", name: "Sarah Connor", email: "sarah@example.com", role: "member" },
    status: "done",
    priority: "high",
  },
  {
    _id: "t2",
    title: "API integration for meetings",
    description: "Connect frontend to backend meeting endpoints",
    assignee: { _id: "u3", name: "Mike Ross", email: "mike@example.com", role: "member" },
    status: "inprogress",
    priority: "high",
  },
  {
    _id: "t3",
    title: "Dashboard UI components",
    description: "Stats cards, meeting list, charts",
    assignee: { _id: "u2", name: "Sarah Connor", email: "sarah@example.com", role: "member" },
    status: "inprogress",
    priority: "medium",
  },
  {
    _id: "t4",
    title: "Mobile responsive fixes",
    description: "Fix layout issues on mobile screens",
    assignee: { _id: "u4", name: "Anna Lee", email: "anna@example.com", role: "member" },
    status: "todo",
    priority: "medium",
  },
  {
    _id: "t5",
    title: "WebRTC video integration",
    description: "Peer connection, media streams",
    assignee: { _id: "u1", name: "Joel Thomas", email: "joel@example.com", role: "admin" },
    status: "todo",
    priority: "high",
  },
  {
    _id: "t6",
    title: "AI transcription setup",
    description: "Integrate OpenAI Whisper API",
    assignee: { _id: "u1", name: "Joel Thomas", email: "joel@example.com", role: "admin" },
    status: "todo",
    priority: "medium",
  },
  {
    _id: "t7",
    title: "Write API documentation",
    description: "Document all REST endpoints",
    assignee: { _id: "u3", name: "Mike Ross", email: "mike@example.com", role: "member" },
    status: "done",
    priority: "low",
  },
];

// Single Task Card Component
function TaskCard({
  task,
  isDragging,
}: {
  task: Task;
  isDragging?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-[#1a1d27] border border-white/5 rounded-xl p-4 space-y-3 group cursor-grab active:cursor-grabbing transition-all duration-200",
        isSortableDragging && "opacity-40",
        isDragging && "shadow-2xl shadow-black/50 rotate-1 scale-105"
      )}
    >
      {/* Drag Handle + Menu */}
      <div className="flex items-start justify-between gap-2">
        <div
          {...attributes}
          {...listeners}
          className="mt-0.5 text-gray-600 hover:text-gray-400 transition-colors cursor-grab"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>
        <p className="flex-1 text-sm font-medium text-white leading-snug">
          {task.title}
        </p>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-white">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 leading-relaxed pl-5">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pl-5">
        <Badge
          className={cn(
            "text-xs border capitalize",
            priorityConfig[task.priority as keyof typeof priorityConfig]
          )}
        >
          {task.priority}
        </Badge>
        {task.assignee && (
          <Avatar className="w-6 h-6">
            <AvatarFallback className="bg-indigo-600 text-white text-[10px] font-medium">
              {task.assignee.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}

// Column Component
function KanbanColumn({
  column,
  tasks,
}: {
  column: (typeof columns)[0];
  tasks: Task[];
}) {
  return (
    <div className="flex-1 min-w-[280px] max-w-[340px] flex flex-col gap-3">
      {/* Column Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={cn("w-2.5 h-2.5 rounded-full", column.color)} />
          <h3 className="text-sm font-semibold text-white">{column.title}</h3>
          <span className="w-5 h-5 bg-white/5 rounded-full text-xs text-gray-400 flex items-center justify-center font-medium">
            {tasks.length}
          </span>
        </div>
        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Drop Zone */}
      <div
        className={cn(
          "flex-1 min-h-[200px] rounded-xl border-2 border-dashed p-3 space-y-2 transition-colors",
          tasks.length === 0
            ? "border-white/5 bg-white/2"
            : "border-transparent bg-transparent"
        )}
      >
        <SortableContext
          items={tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-gray-600">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const getTasksByStatus = (status: string) =>
    tasks.filter((t) => t.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t._id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropped over a column
    const overColumn = columns.find((c) => c.id === overId);
    if (overColumn) {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === activeId
            ? { ...t, status: overColumn.id as Task["status"] }
            : t
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find target column from over task or column id
    const overTask = tasks.find((t) => t._id === overId);
    const targetStatus = overTask
      ? overTask.status
      : columns.find((c) => c.id === overId)?.id;

    if (targetStatus) {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === activeId
            ? { ...t, status: targetStatus as Task["status"] }
            : t
        )
      );
      toast.success("Task moved successfully!");
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-5 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={getTasksByStatus(column.id)}
          />
        ))}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isDragging />}
      </DragOverlay>
    </DndContext>
  );
}