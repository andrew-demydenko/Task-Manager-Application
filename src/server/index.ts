import { Model, Server, Factory, belongsTo } from "miragejs";
import type { ModelDefinition, Registry } from "miragejs/-types";
import type { IProject, IUser, ITask } from "@/types";

const UserModel: ModelDefinition<IUser> = Model.extend({});
const ProjectModel: ModelDefinition<IProject> = Model.extend({});
const TaskModel: ModelDefinition<ITask> = Model.extend({
  project: belongsTo("project"),
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
      users: UserModel,
      projects: ProjectModel,
      tasks: TaskModel,
    },

    seeds(server) {
      server.db.loadData({
        users: [{ name: "admin", id: "1" }],
      });
    },

    routes() {
      this.namespace = "api";

      this.get("/users", (schema) => {
        return schema.all("users");
      });

      this.get("/users/:name", (schema, request) => {
        return schema.where("users", {
          name: request.params.name,
        } as Partial<IUser>);
      });

      this.get("/projects", (schema) => {
        return schema.all("projects");
      });

      this.get("/projects/:id", (schema, request) => {
        const project = schema.find("projects", request.params.id);

        if (project) {
          return project;
        } else {
          throw new Error("Project not found");
        }
      });

      this.delete("/projects/:id", (schema, request) => {
        const projectId = request.params.id;
        const project = schema.find("projects", projectId);
        if (project) {
          project.destroy();
          return { success: true };
        } else {
          throw new Error("Project not found");
        }
      });

      this.post("/projects", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const project = schema.findBy("projects", {
          name: attrs.name,
        } as Partial<IProject>);
        if (project) {
          throw new Error("Project with this name already exists");
        }
        return schema.create("projects", attrs);
      });

      this.post("/task", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create("task", attrs);
      });

      this.put("/task", (schema, request) => {
        const task = schema.find("task", JSON.parse(request.requestBody).id);
        if (task) {
          task?.update(JSON.parse(request.requestBody));
          return task;
        } else {
          throw new Error("Task not found");
        }
      });

      this.delete("/task/:id", (schema, request) => {
        const taskId = request.params.id;
        const task = schema.find("task", taskId);
        if (task) {
          task.destroy();
          return { success: true };
        } else {
          throw new Error("Task not found");
        }
      });
    },
  });

  return server;
}
