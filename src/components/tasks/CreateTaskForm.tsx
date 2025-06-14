import { useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { createNewTask, fetchTasks } from "@/store/thunks/taskThunks";
import DatePicker from "react-datepicker";
import type { IProject } from "@/types/project";
import type { ITask } from "@/types/task";

interface CreateTaskFormProps {
  onClose: () => void;
  project: IProject;
}

export default function CreateTaskForm({
  onClose,
  project,
}: CreateTaskFormProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<ITask["priority"]>("medium");
  const [status, setStatus] = useState<ITask["status"]>("pending");
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Task name is required");
      return;
    }

    if (!dueDate) {
      setError("Due date is required");
      return;
    }

    try {
      setIsPending(true);
      await dispatch(
        createNewTask({
          name: name.trim(),
          description: description.trim(),
          priority,
          status,
          dueDate: dueDate.toISOString(),
          projectId: project.id,
        })
      ).unwrap();
      setIsPending(false);
      onClose();

      await dispatch(fetchTasks(project.id)).unwrap();
    } catch (err) {
      setIsPending(false);
      setError("Failed to create task.");
      console.error("Error creating task:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-400 py-3 rounded">{error}</div>}

      <div className="mb-2">
        <label htmlFor="name">Task Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-gray-300 border rounded w-full py-2 px-3 mt-2"
          placeholder="Enter task name"
        />
      </div>

      <div className="mb-2">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
            onChange={(e) => setPriority(e.target.value as ITask["priority"])}
            className="border-gray-300 border rounded w-full py-2 px-3 mt-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="w-1/2 mb-2">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ITask["status"])}
            className="border-gray-300 border rounded w-full py-2 px-3 mt-2"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
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
          onChange={(date) => setDueDate(date)}
          className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 mt-2"
          dateFormat="MMMM d, yyyy"
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-solid border-gray-300">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white uppercase text-sm px-6 py-3 rounded mr-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white uppercase text-sm px-6 py-3 rounded"
        >
          {isPending ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
