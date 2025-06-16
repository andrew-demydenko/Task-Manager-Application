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
  createNewTask: vi.fn().mockImplementation(() => ({
    unwrap: vi.fn().mockResolvedValue({}),
    type: "tasks/createNewTask",
    dispatch: vi.fn().mockResolvedValue({}),
    fulfilled: { type: "tasks/createNewTask/fulfilled" },
  })),
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
}));

describe("TaskForm", () => {
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
    priority: "high",
    status: "pending",
    projectId: "project-1",
    dueDate: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly in create mode with all form elements", () => {
    render(
      <TaskForm onClose={mockOnClose} project={mockProject} task={null} />
    );

    expect(screen.getByLabelText(/task name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("renders correctly in edit mode with pre-filled values", () => {
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
  });

  it("shows error when submitting with empty task name", async () => {
    render(
      <TaskForm onClose={mockOnClose} project={mockProject} task={null} />
    );

    fireEvent.change(screen.getByLabelText(/task name/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText(/task name is required/i)).toBeInTheDocument();
    expect(taskThunks.createNewTask).not.toHaveBeenCalled();
    expect(taskThunks.updateTaskThunk).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("shows error when submitting with no due date", async () => {
    render(
      <TaskForm onClose={mockOnClose} project={mockProject} task={null} />
    );

    fireEvent.change(screen.getByLabelText(/task name/i), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByTestId("datepicker"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText(/due date is required/i)).toBeInTheDocument();
    expect(taskThunks.createNewTask).not.toHaveBeenCalled();
  });

  it("calls createNewTask thunk and closes form on successful submission in create mode", async () => {
    const mockDispatchResult = {
      unwrap: vi.fn().mockResolvedValue({}),
      type: "tasks/createNewTask",
      dispatch: vi.fn().mockResolvedValue({}),
      fulfilled: { type: "tasks/createNewTask/fulfilled" },
    };
    // @ts-expect-error: mock redux thunk
    vi.mocked(taskThunks.createNewTask).mockReturnValue(mockDispatchResult);

    const mockFetchResult = {
      unwrap: vi.fn().mockResolvedValue([]),
      type: "tasks/fetchTasks",
      dispatch: vi.fn().mockResolvedValue([]),
      fulfilled: { type: "tasks/fetchTasks/fulfilled" },
    };
    // @ts-expect-error: mock redux thunk
    vi.mocked(taskThunks.fetchTasks).mockReturnValue(mockFetchResult);

    render(
      <TaskForm onClose={mockOnClose} project={mockProject} task={null} />
    );

    fireEvent.change(screen.getByLabelText(/task name/i), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "New Description" },
    });
    fireEvent.change(screen.getByLabelText(/priority/i), {
      target: { value: "high" },
    });
    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: "in-progress" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(taskThunks.createNewTask).toHaveBeenCalledWith({
        name: "New Task",
        description: "New Description",
        priority: "high",
        status: "in-progress",
        dueDate: expect.any(String),
        projectId: mockProject.id,
      });

      expect(mockOnClose).toHaveBeenCalled();
      expect(taskThunks.fetchTasks).toHaveBeenCalledWith(mockProject.id);
    });
  });

  it("calls updateTaskThunk and closes form on successful submission in edit mode", async () => {
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
      target: { value: "Updated Task" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Updated Description" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(taskThunks.updateTaskThunk).toHaveBeenCalledWith({
        taskId: mockTask.id,
        taskData: expect.objectContaining({
          name: "Updated Task",
          description: "Updated Description",
        }),
      });
      expect(mockOnClose).toHaveBeenCalled();
      expect(taskThunks.fetchTasks).toHaveBeenCalledWith(mockProject.id);
    });
  });

  it("shows error message when task creation fails", async () => {
    const mockError = new Error("Creation failed");
    const mockDispatchResult = {
      unwrap: vi.fn().mockRejectedValue(mockError),
      type: "tasks/createNewTask",
      dispatch: vi.fn().mockRejectedValue(mockError),
      fulfilled: { type: "tasks/createNewTask/fulfilled" },
    };
    // @ts-expect-error: mock redux thunk
    vi.mocked(taskThunks.createNewTask).mockReturnValue(mockDispatchResult);

    render(
      <TaskForm onClose={mockOnClose} project={mockProject} task={null} />
    );

    fireEvent.change(screen.getByLabelText(/task name/i), {
      target: { value: "New Task" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to save task/i)).toBeInTheDocument();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it("shows error message when task update fails", async () => {
    const mockError = new Error("Update failed");
    const mockDispatchResult = {
      unwrap: vi.fn().mockRejectedValue(mockError),
      type: "tasks/updateTask",
      dispatch: vi.fn().mockRejectedValue(mockError),
      fulfilled: { type: "tasks/updateTask/fulfilled" },
    };
    // @ts-expect-error: mock redux thunk
    vi.mocked(taskThunks.updateTaskThunk).mockReturnValue(mockDispatchResult);

    render(
      <TaskForm onClose={mockOnClose} project={mockProject} task={mockTask} />
    );

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to save task/i)).toBeInTheDocument();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it("cancels form submission when Cancel button is clicked", () => {
    render(
      <TaskForm onClose={mockOnClose} project={mockProject} task={null} />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockOnClose).toHaveBeenCalled();
    expect(taskThunks.createNewTask).not.toHaveBeenCalled();
    expect(taskThunks.updateTaskThunk).not.toHaveBeenCalled();
  });
});
