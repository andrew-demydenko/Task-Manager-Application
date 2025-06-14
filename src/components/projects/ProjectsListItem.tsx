import type { IProject } from "@/types";
import { Link } from "react-router";
import { useAppDispatch } from "@/hooks/redux";
import { removeProject } from "@/store/thunks/projectThunks";
import { useState } from "react";

interface ProjectsListItemProps {
  project: IProject;
}

export default function ProjectsListItem({ project }: ProjectsListItemProps) {
  const { name, dueDate, id } = project;
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDeleting(true);
    try {
      await dispatch(removeProject(id)).unwrap();
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex p-3 border border-gray-300 shadow-md card rounded justify-between items-center">
      <div>
        <div>
          Project name:
          <Link
            className="text-blue-400 hover:underline ml-2"
            to={`/projects/${id}`}
          >
            {name}
          </Link>
        </div>
        <div>Due Date: {new Date(dueDate).toLocaleDateString()}</div>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="cursor-pointer bg-red-500 text-white font-bold py-1 px-2 rounded text-sm"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
