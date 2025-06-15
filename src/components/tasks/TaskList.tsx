import type { ITask } from "@/types/task";
import TaskListItem from "./TaskListItem";

interface TaskListProps {
  tasks: ITask[];
  onEditTask: (task: ITask) => void;
}

export default function TaskList({ tasks, onEditTask }: TaskListProps) {
  if (tasks.length === 0) {
    return <div className="text-gray-500 mt-4">No tasks found.</div>;
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskListItem key={task.id} task={task} onEdit={onEditTask} />
      ))}
    </div>
  );
}
