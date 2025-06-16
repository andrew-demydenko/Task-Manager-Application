import { useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { createNewProject } from "@/store/thunks/projectThunks";
import DatePicker from "react-datepicker";

interface CreateProjectFormProps {
  onClose: () => void;
}

export default function CreateProjectForm({ onClose }: CreateProjectFormProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    if (!dueDate) {
      setError("Due date is required");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      setError("Due date cannot be earlier than today");
      return;
    }

    try {
      if (name && dueDate) {
        setIsPending(true);
        await dispatch(
          createNewProject({
            name: name.trim(),
            dueDate: dueDate.toISOString(),
          })
        ).unwrap();
      }

      setIsPending(false);
      onClose();
    } catch (err) {
      setIsPending(false);
      setError("Failed to create project.");
      console.error("Error creating project:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-400">{error}</div>}
      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Project Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded w-full py-2 px-3 text-gray-700 border-gray-300"
          placeholder="Enter project name"
        />
      </div>

      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="dueDate"
        >
          Due Date
        </label>
        <DatePicker
          id="dueDate"
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          className="rounded w-full py-2 px-3 text-gray-700 border-1 border-gray-300"
          dateFormat="MMMM d, yyyy"
          minDate={new Date()}
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
          {isPending ? "Loading..." : "Create"}
        </button>
      </div>
    </form>
  );
}
