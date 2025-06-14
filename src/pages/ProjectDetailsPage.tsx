import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchProjectById } from "@/store/thunks/projectThunks";
import { fetchTasks } from "@/store/thunks/taskThunks";
import TaskList from "@/components/tasks/TaskList";
import Modal from "@/components/common/Modal";
import CreateTaskForm from "@/components/tasks/CreateTaskForm";

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const dispatch = useAppDispatch();
  const { projectDetails, loading: projectLoading } = useAppSelector(
    (state) => state.projects
  );
  const { tasks, loading: tasksLoading } = useAppSelector(
    (state) => state.tasks
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      Promise.all([
        dispatch(fetchProjectById(projectId)),
        dispatch(fetchTasks(projectId)),
      ]);
    }
  }, [dispatch, projectId]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (projectLoading) {
    return <div className="container mx-auto p-4">Loading project...</div>;
  }

  if (!projectDetails) {
    return <div className="container mx-auto p-4">Project not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">{projectDetails.name}</h1>
          <p className="text-gray-600">
            Due Date: {new Date(projectDetails.dueDate).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="cursor-pointer bg-blue-500 uppercase text-white py-2 px-4 rounded"
        >
          Add Task
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
        {tasksLoading ? (
          <div>Loading tasks...</div>
        ) : (
          <TaskList tasks={tasks} />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create New Task"
      >
        <CreateTaskForm onClose={handleCloseModal} project={projectDetails} />
      </Modal>
    </div>
  );
}
