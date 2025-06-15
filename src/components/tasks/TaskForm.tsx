import { useReducer, useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux";
import {
  createNewTask,
  fetchTasks,
  updateTaskThunk,
} from "@/store/thunks/taskThunks";
import DatePicker from "react-datepicker";
import type { IProject } from "@/types/project";
import type { ITask } from "@/types/task";
import { TASK_STATUSES, TASK_PRIORITIES } from "@/constants/task";

interface TaskFormProps {
  onClose: () => void;
  project: IProject;
  task: ITask | null;
}

interface TaskFormState {
  name: string;
  description: string;
  priority: ITask["priority"];
  status: ITask["status"];
  dueDate: Date | null;
  error: string;
  isPending: boolean;
}

type TaskFormAction =
  | {
      type: "SET_FIELD";
      field: keyof Omit<TaskFormState, "error" | "isPending">;
      value: string | Date | null;
    }
  | { type: "SET_ERROR"; error: string }
  | { type: "SET_PENDING"; isPending: boolean }
  | { type: "RESET_FORM" }
  | { type: "LOAD_TASK"; task: ITask };

const initialState: TaskFormState = {
  name: "",
  description: "",
  priority: "medium",
  status: "pending",
  dueDate: new Date(),
  error: "",
  isPending: false,
};

function taskFormReducer(
  state: TaskFormState,
  action: TaskFormAction
): TaskFormState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "SET_PENDING":
      return {
        ...state,
        isPending: action.isPending,
      };
    case "LOAD_TASK":
      return {
        ...state,
        name: action.task.name,
        description: action.task.description,
        priority: action.task.priority,
        status: action.task.status,
        dueDate: action.task.dueDate
          ? new Date(action.task.dueDate)
          : new Date(),
      };
    default:
      return state;
  }
}

export default function TaskForm({ onClose, project, task }: TaskFormProps) {
  const appDispatch = useAppDispatch();
  const [state, dispatch] = useReducer(taskFormReducer, initialState);
  const { name, description, priority, status, dueDate, error, isPending } =
    state;

  useEffect(() => {
    if (task) {
      dispatch({ type: "LOAD_TASK", task });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      dispatch({ type: "SET_ERROR", error: "Task name is required" });
      return;
    }

    if (!dueDate) {
      dispatch({ type: "SET_ERROR", error: "Due date is required" });
      return;
    }

    try {
      dispatch({ type: "SET_PENDING", isPending: true });

      const taskData = {
        name: name.trim(),
        description: description.trim(),
        priority,
        status,
        dueDate: dueDate.toISOString(),
        projectId: project.id,
      };

      if (task) {
        await appDispatch(
          updateTaskThunk({
            taskId: task.id,
            taskData,
          })
        ).unwrap();
      } else {
        await appDispatch(createNewTask(taskData)).unwrap();
      }

      dispatch({ type: "SET_PENDING", isPending: false });
      onClose();

      await appDispatch(fetchTasks(project.id)).unwrap();
    } catch (err) {
      dispatch({ type: "SET_PENDING", isPending: false });
      dispatch({ type: "SET_ERROR", error: "Failed to save task." });
      console.error("Error save task:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-400 rounded">{error}</div>}

      <div className="mb-2">
        <label htmlFor="name">Task Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "name",
              value: e.target.value,
            })
          }
          className="border-gray-300 border rounded w-full py-2 px-3 mt-2"
          placeholder="Enter task name"
        />
      </div>

      <div className="mb-2">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "description",
              value: e.target.value,
            })
          }
          className="border-gray-300 border rounded w-full py-2 px-3 mt-2 max-h-[300px]"
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <div className="flex space-x-4 mb-2">
        <div className="w-1/2">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "priority",
                value: e.target.value as ITask["priority"],
              })
            }
            className="border-gray-300 border rounded w-full py-2 px-3 mt-2"
          >
            {Object.entries(TASK_PRIORITIES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-1/2 mb-2">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "status",
                value: e.target.value as ITask["status"],
              })
            }
            className="border-gray-300 border rounded w-full py-2 px-3 mt-2"
          >
            {Object.entries(TASK_STATUSES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-2">
        <label className="mr-2" htmlFor="dueDate">
          Due Date
        </label>
        <DatePicker
          id="dueDate"
          selected={dueDate}
          onChange={(date) =>
            dispatch({
              type: "SET_FIELD",
              field: "dueDate",
              value: date,
            })
          }
          className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 mt-2"
          dateFormat="MMMM d, yyyy"
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-solid border-gray-300">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer bg-gray-500 text-white uppercase text-sm px-6 py-3 rounded mr-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="cursor-pointer bg-blue-500 text-white uppercase text-sm px-6 py-3 rounded"
        >
          {isPending ? "Loading..." : "Save"}
        </button>
      </div>
    </form>
  );
}
