import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchProjectById } from "@/store/thunks/projectThunks";
import { fetchTasks } from "@/store/thunks/taskThunks";
import TaskList from "@/components/tasks/TaskList";
import WithFilters from "@/components/tasks/WithFilters";
import Modal from "@/components/common/Modal";
import TaskForm from "@/components/tasks/TaskForm";
import type { ITask } from "@/types/task";

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const dispatch = useAppDispatch();
  const { projectDetails, loading: projectLoading } = useAppSelector(
    (state) => state.projects
  );
  const [isTaskFromModalOpen, setIsTaskFromModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null);

  useEffect(() => {
    if (projectId) {
      Promise.all([
        dispatch(fetchProjectById(projectId)),
        dispatch(fetchTasks(projectId)),
      ]);
    }
  }, [dispatch, projectId]);

  const handleOpenTaskModal = () => {
    setTaskToEdit(null);
    setIsTaskFromModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setTaskToEdit(null);
    setIsTaskFromModalOpen(false);
  };

  const handleOpenEditModal = (task: ITask) => {
    setIsTaskFromModalOpen(true);
    setTaskToEdit(task);
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
        <div>
          <Link
            to="/projects"
            className="mr-5 text-blue-500 hover:underline font-medium uppercase"
          >
            Projects
          </Link>
          <button
            onClick={handleOpenTaskModal}
            className="cursor-pointer bg-blue-500 uppercase text-white py-2 px-4 rounded"
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
        <WithFilters>
          {({ filteredTasks }) => (
            <TaskList tasks={filteredTasks} onEditTask={handleOpenEditModal} />
          )}
        </WithFilters>
      </div>

      <Modal
        isOpen={isTaskFromModalOpen}
        onClose={handleCloseTaskModal}
        title={taskToEdit ? "Edit Task" : "Create New Task"}
      >
        <TaskForm
          onClose={handleCloseTaskModal}
          project={projectDetails}
          task={taskToEdit}
        />
      </Modal>
    </div>
  );
}
