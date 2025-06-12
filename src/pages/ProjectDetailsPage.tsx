import { useEffect } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchProjectById } from "@/store/thunks/projectThunks";

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const dispatch = useAppDispatch();
  const { projectDetails, loading } = useAppSelector((state) => state.projects);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }
  }, [dispatch, projectId]);

  if (loading) {
    return <div>Loading project...</div>;
  }

  if (!projectDetails) {
    return <div>Project not found</div>;
  }

  return (
    <div>
      <h1 className="text-4xl">{projectDetails.name}</h1>
      <p>Due Date: {new Date(projectDetails.dueDate).toLocaleDateString()}</p>
    </div>
  );
}
