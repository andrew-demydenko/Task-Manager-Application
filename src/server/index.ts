import { Model, Server, Factory, belongsTo, hasMany } from "miragejs";
import type { ModelDefinition, Registry } from "miragejs/-types";
import type { IProject, IUser, ITask } from "@/types";

const UserModel: ModelDefinition<IUser> = Model.extend({});
const ProjectModel: ModelDefinition<IProject> = Model.extend({
  tasks: hasMany("tasks"),
});
const TaskModel: ModelDefinition<ITask> = Model.extend({
  project: belongsTo("projects"),
});

type AppModels = {
  user: typeof UserModel;
  project: typeof ProjectModel;
  task: typeof TaskModel;
};

type AppRegistry = Registry<AppModels, Record<string, typeof Factory>>;

export function makeServer(): Server<AppRegistry> {
  const server = new Server({
    logging: true,
    models: {
      user: UserModel,
      project: ProjectModel,
      task: TaskModel,
    },

    seeds(server) {
      server.db.loadData({
        users: [{ name: "admin", id: "1" }],
        projects: [
          { id: "1", name: "Project 1", dueDate: "2025-12-31" },
          { id: "2", name: "Project 2", dueDate: "2025-10-15" },
        ],
        tasks: [
          {
            id: "1",
            name: "Task 1",
            description: "Description for task 1",
            status: "pending",
            priority: "high",
            projectId: "1",
            dueDate: "2025-08-15",
          },
          {
            id: "2",
            name: "Task 2",
            description: "Description for task 2",
            status: "in-progress",
            priority: "medium",
            projectId: "1",
            dueDate: "2025-09-01",
          },
          {
            id: "3",
            name: "Task 3",
            description: "Description for task 3",
            status: "completed",
            priority: "low",
            projectId: "2",
            dueDate: "2025-07-20",
          },
        ],
      });
    },

    routes() {
      this.namespace = "api";

      this.get("/users", (schema) => {
        return schema.all("user");
      });

      this.get("/users/:name", (schema, request) => {
        return schema.where("user", {
          name: request.params.name,
        } as Partial<IUser>);
      });

      this.get("/projects", (schema) => {
        return schema.all("project");
      });

      this.get("/projects/:id", (schema, request) => {
        const project = schema.find("project", request.params.id);

        if (project) {
          return project;
        } else {
          throw new Error("Project not found");
        }
      });

      this.delete("/projects/:id", (schema, request) => {
        const projectId = request.params.id;
        const project = schema.find("project", projectId);
        if (project) {
          project.destroy();
          return { success: true };
        } else {
          throw new Error("Project not found");
        }
      });

      this.post("/projects", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const project = schema.findBy("project", {
          name: attrs.name,
        } as Partial<IProject>);
        if (project) {
          throw new Error("Project with this name already exists");
        }
        return schema.create("project", attrs);
      });

      this.get("/tasks/:projectId", (schema, request) => {
        const projectId = request.params.projectId;

        if (projectId) {
          return schema.where("task", { projectId } as Partial<ITask>);
        } else {
          return schema.all("task");
        }
      });

      this.post("/tasks", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create("task", attrs);
      });

      this.put("/tasks/:id", (schema, request) => {
        const taskId = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const task = schema.find("task", taskId);

        if (task) {
          task.update(attrs);
          return task;
        } else {
          throw new Error("Task not found");
        }
      });

      this.delete("/tasks/:id", (schema, request) => {
        const taskId = request.params.id;
        const task = schema.find("task", taskId);

        if (task) {
          task.destroy();
          return { success: true };
        } else {
          throw new Error("Task not found");
        }
      });

      this.get("/current-user", (schema, request) => {
        const authHeader = request.requestHeaders.Authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
          const token = authHeader.substring(7);

          if (token) {
            return { user: { id: "1", name: "admin" } };
          }
        }

        throw new Error("Unauthorized");
      });
    },
  });

  return server;
}
