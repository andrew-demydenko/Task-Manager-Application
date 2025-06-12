import type { IProject } from "@/types";

interface ProjectsListItemProps {
  project: IProject;
}

export default function ProjectsListItem({ project }: ProjectsListItemProps) {
  const { name, dueDate } = project;

  return (
    <div className="d-flex flex-column gap-2 p-3 border rounded">
      <div>{name}</div>
      <div>Due Date: {new Date(dueDate).toLocaleDateString()}</div>
    </div>
  );
}
