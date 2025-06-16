import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "@/tests/test-utils";
import CreateProjectForm from "../CreateProjectForm";
import * as projectThunks from "@/store/thunks/projectThunks";

vi.mock("@/store/thunks/projectThunks", () => ({
  createNewProject: vi.fn().mockImplementation(() => ({
    unwrap: vi.fn().mockResolvedValue({}),
    type: "projects/createNewProject",
    dispatch: vi.fn().mockResolvedValue({}),
    fulfilled: { type: "projects/createNewProject/fulfilled" },
  })),
}));

describe("CreateProjectForm", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with all form elements", () => {
    render(<CreateProjectForm onClose={mockOnClose} />);

    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
  });

  it("shows error when submitting with empty project name", async () => {
    render(<CreateProjectForm onClose={mockOnClose} />);

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    expect(screen.getByText(/project name is required/i)).toBeInTheDocument();

    expect(projectThunks.createNewProject).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("calls createNewProject thunk and closes modal on successful submission", async () => {
    const mockDispatchResult = {
      unwrap: vi.fn().mockResolvedValue({}),
      type: "projects/createNewProject",
      dispatch: vi.fn().mockResolvedValue({}),
      fulfilled: { type: "projects/createNewProject/fulfilled" },
    };
    vi.mocked(projectThunks.createNewProject).mockReturnValue(
      // @ts-expect-error: mock redux thunk
      mockDispatchResult
    );

    render(<CreateProjectForm onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText(/project name/i), {
      target: { value: "Test Project" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(projectThunks.createNewProject).toHaveBeenCalledWith({
        name: "Test Project",
        dueDate: expect.any(String),
      });

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("shows error message when project creation fails", async () => {
    const mockError = new Error("Creation failed");
    const mockDispatchResult = {
      unwrap: vi.fn().mockRejectedValue(mockError),
      type: "projects/createNewProject",
      dispatch: vi.fn().mockRejectedValue(mockError),
      fulfilled: { type: "projects/createNewProject/fulfilled" },
    };

    vi.mocked(projectThunks.createNewProject).mockReturnValue(
      // @ts-expect-error: mock redux thunk
      mockDispatchResult
    );

    render(<CreateProjectForm onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText(/project name/i), {
      target: { value: "Test Project" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to create project/i)).toBeInTheDocument();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it("cancels form submission when Cancel button is clicked", () => {
    render(<CreateProjectForm onClose={mockOnClose} />);

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockOnClose).toHaveBeenCalled();
    expect(projectThunks.createNewProject).not.toHaveBeenCalled();
  });
});
