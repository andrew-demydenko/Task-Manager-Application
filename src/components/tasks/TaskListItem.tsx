import { useState } from "react";
import type { ITask } from "@/types/task";
import { useAppDispatch } from "@/hooks/redux";
import { removeTask, fetchTasks } from "@/store/thunks/taskThunks";
import { TASK_STATUSES } from "@/constants/task";

interface TaskListItemProps {
  task: ITask;
}

export default function TaskListItem({ task }: TaskListItemProps) {
  const { id, name, description, status, priority, dueDate } = task;
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDeleting(true);
    try {
      await dispatch(removeTask(id)).unwrap();
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      dispatch(fetchTasks(task.projectId));
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-white mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-2">{name}</h3>
          <p className="text-gray-600 mb-3">{description}</p>
          <div className="flex space-x-2 mb-2">
            <span
              className={
                "px-2 py-1 rounded text-xs uppercase bg-blue-500 text-white font-medium"
              }
            >
              {priority}
            </span>
            <span
              className={
                "px-2 py-1 rounded bg-amber-500 text-white text-xs font-medium"
              }
            >
              {TASK_STATUSES[status]}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Due: {new Date(dueDate).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
