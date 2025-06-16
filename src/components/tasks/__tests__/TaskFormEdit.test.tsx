import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "@/tests/test-utils";
import TaskForm from "../TaskForm";
import * as taskThunks from "@/store/thunks/taskThunks";
import type { ITask } from "@/types/task";

vi.mock("react-datepicker", () => {
  return {
    default: vi.fn(({ selected, onChange, ...props }) => {
      return (
        <input
          data-testid="datepicker"
          value={selected ? selected.toISOString().split("T")[0] : ""}
          onChange={(e) => {
            const value = e.target.value;
            const date = value ? new Date(value) : null;
            onChange(date);
          }}
          type="date"
          {...props}
        />
      );
    }),
  };
});

vi.mock("@/store/thunks/taskThunks", () => ({
  updateTaskThunk: vi.fn().mockImplementation(() => ({
    unwrap: vi.fn().mockResolvedValue({}),
    type: "tasks/updateTask",
    dispatch: vi.fn().mockResolvedValue({}),
    fulfilled: { type: "tasks/updateTask/fulfilled" },
  })),
  fetchTasks: vi.fn().mockImplementation(() => ({
    unwrap: vi.fn().mockResolvedValue([]),
    type: "tasks/fetchTasks",
    dispatch: vi.fn().mockResolvedValue([]),
    fulfilled: { type: "tasks/fetchTasks/fulfilled" },
  })),
  createNewTask: vi.fn().mockImplementation(() => ({
    unwrap: vi.fn().mockResolvedValue({}),
    type: "tasks/createNewTask",
    dispatch: vi.fn().mockResolvedValue({}),
    fulfilled: { type: "tasks/createNewTask/fulfilled" },
  })),
}));

describe("TaskForm in Edit Mode", () => {
  const mockOnClose = vi.fn();
  const mockProject = {
    id: "project-1",
    name: "Test Project",
    dueDate: new Date().toISOString(),
  };

  const mockTask: ITask = {
    id: "task-1",
    name: "Test Task",
    description: "Test Description",
    priority: "high" as const,
    status: "pending" as const,
    projectId: "project-1",
    dueDate: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly in edit mode with pre-filled task data", () => {
    render(
      <TaskForm onClose={mockOnClose} project={mockProject} task={mockTask} />
    );

    expect(screen.getByLabelText(/task name/i)).toHaveValue(mockTask.name);
    expect(screen.getByLabelText(/description/i)).toHaveValue(
      mockTask.description
    );
    expect(screen.getByLabelText(/priority/i)).toHaveValue(mockTask.priority);
    expect(screen.getByLabelText(/status/i)).toHaveValue(mockTask.status);
    expect(screen.getByTestId("datepicker")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("updates task when form is submitted with valid data", async () => {
    const mockUpdateResult = {
      unwrap: vi.fn().mockResolvedValue({}),
      type: "tasks/updateTask",
      dispatch: vi.fn().mockResolvedValue({}),
      fulfilled: { type: "tasks/updateTask/fulfilled" },
    };
    // @ts-expect-error: mock redux thunk
    vi.mocked(taskThunks.updateTaskThunk).mockReturnValue(mockUpdateResult);

    const mockFetchResult = {
      unwrap: vi.fn().mockResolvedValue([]),
      type: "tasks/fetchTasks",
      dispatch: vi.fn().mockResolvedValue([]),
      fulfilled: { type: "tasks/fetchTasks/fulfilled" },
    };
    // @ts-expect-error: mock redux thunk
    vi.mocked(taskThunks.fetchTasks).mockReturnValue(mockFetchResult);

    render(
      <TaskForm onClose={mockOnClose} project={mockProject} task={mockTask} />
    );

    fireEvent.change(screen.getByLabelText(/task name/i), {
      target: { value: "Updated Task Name" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Updated Description" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(taskThunks.updateTaskThunk).toHaveBeenCalledWith({
        taskId: mockTask.id,
        taskData: expect.objectContaining({
          name: "Updated Task Name",
          description: "Updated Description",
        }),
      });
      expect(mockOnClose).toHaveBeenCalled();
      expect(taskThunks.fetchTasks).toHaveBeenCalledWith(mockProject.id);
    });
  });

  it("displays validation error when submitting with empty task name", async () => {
    render(
      <TaskForm onClose={mockOnClose} project={mockProject} task={mockTask} />
    );

    fireEvent.change(screen.getByLabelText(/task name/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText(/task name is required/i)).toBeInTheDocument();
    expect(taskThunks.updateTaskThunk).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("displays validation error when submitting with empty due date", async () => {
    render(
      <TaskForm onClose={mockOnClose} project={mockProject} task={mockTask} />
    );

    fireEvent.change(screen.getByTestId("datepicker"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText(/due date is required/i)).toBeInTheDocument();
    expect(taskThunks.updateTaskThunk).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("shows error message when task update fails", async () => {
    const mockError = new Error("Update failed");
    const mockErrorResult = {
      unwrap: vi.fn().mockRejectedValue(mockError),
      type: "tasks/updateTask",
      dispatch: vi.fn().mockRejectedValue(mockError),
      fulfilled: { type: "tasks/updateTask/fulfilled" },
    };
    // @ts-expect-error: mock redux thunk
    vi.mocked(taskThunks.updateTaskThunk).mockReturnValue(mockErrorResult);

    render(
      <TaskForm onClose={mockOnClose} project={mockProject} task={mockTask} />
    );

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to save task/i)).toBeInTheDocument();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it("closes form without updating when cancel button is clicked", () => {
    render(
      <TaskForm onClose={mockOnClose} project={mockProject} task={mockTask} />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockOnClose).toHaveBeenCalled();
    expect(taskThunks.updateTaskThunk).not.toHaveBeenCalled();
  });
});
