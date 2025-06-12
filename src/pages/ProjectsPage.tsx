import { useEffect } from "react";
import ProjectsList from "@/components/projects/ProjectsList";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchProjects } from "@/store/thunks/projectThunks";

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-5xl">Projects</h1>
      {loading ? (
        <div>Loading projects...</div>
      ) : (
        <ProjectsList projects={projects} />
      )}
    </div>
  );
}
