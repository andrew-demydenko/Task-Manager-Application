import { useEffect, useState } from "react";
import ProjectsList from "@/components/projects/ProjectsList";
import Modal from "@/components/common/Modal";
import CreateProjectForm from "@/components/projects/CreateProjectForm";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchProjects } from "@/store/thunks/projectThunks";

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.projects);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl">Projects</h1>
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Create Project
        </button>
      </div>

      {loading ? (
        <div>Loading projects...</div>
      ) : (
        <ProjectsList projects={projects} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create New Project"
      >
        <CreateProjectForm onClose={handleCloseModal} />
      </Modal>
    </div>
  );
}
