import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { ITask } from "@/types/task";
import FilterSelect from "@/components/common/FilterSelect";
import { useAppSelector } from "@/hooks/redux";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/constants/task";

export type StatusFilter = "all" | ITask["status"];
export type PriorityFilter = "all" | ITask["priority"];

interface WithFiltersProps {
  children: (props: { filteredTasks: ITask[] }) => ReactNode;
}

export default function WithFilters({ children }: WithFiltersProps) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const tasksLoading = useAppSelector((state) => state.tasks.loading);

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesStatus = status === "all" || task.status === status;
        const matchesPriority =
          priority === "all" || task.priority === priority;
        return matchesStatus && matchesPriority;
      }),
    [tasks, status, priority]
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        <FilterSelect
          id="status-filter"
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "All Statuses" },
            ...Object.entries(TASK_STATUSES).map(([value, label]) => ({
              value: value as ITask["status"],
              label,
            })),
          ]}
        />

        <FilterSelect
          id="priority-filter"
          label="Priority"
          value={priority}
          onChange={setPriority}
          options={[
            { value: "all", label: "All Priorities" },
            ...Object.entries(TASK_PRIORITIES).map(([value, label]) => ({
              value: value as ITask["priority"],
              label,
            })),
          ]}
        />
      </div>
      {tasksLoading ? (
        <div>Loading tasks...</div>
      ) : (
        <div className="overflow-y-auto">
          {children({
            filteredTasks,
          })}
        </div>
      )}
    </div>
  );
}
