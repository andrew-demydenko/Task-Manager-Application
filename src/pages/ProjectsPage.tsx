import { getProjects } from "@/services/projectService";
import { useEffect, useState } from "react";
import ProjectsList from "@/components/projects/ProjectsList";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getProjects();
        setProjects(projects);
        console.log("Projects fetched:", projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <h1 className="text-5xl">Projects</h1>
      <ProjectsList projects={projects} />
    </div>
  );
}
