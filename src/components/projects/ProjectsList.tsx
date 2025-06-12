import type { IProject } from "@/types";
import ProjectsListItem from "./ProjectsListItem";

interface ProjectsListProps {
  projects: IProject[];
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  if (!projects || projects.length === 0) {
    return <div className="projects-list">No projects found</div>;
  }
  return (
    <div className="projects-list">
      <div>
        {projects.map((project) => (
          <ProjectsListItem key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
