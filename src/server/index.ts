import { Model, Server, Factory, belongsTo } from "miragejs";
import type { ModelDefinition, Registry } from "miragejs/-types";

interface User {
  name: string;
}

interface Project {
  name: string;
  dueDate: string;
}

interface Task {
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
}

const UserModel: ModelDefinition<User> = Model.extend({});
const ProjectModel: ModelDefinition<Project> = Model.extend({});
const TaskModel: ModelDefinition<Task> = Model.extend({
  project: belongsTo("project"),
});

type AppModels = {
  user: typeof UserModel;
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
        users: [{ name: "admin" }],
      });
    },

    routes() {
      this.namespace = "api";

      this.get("/users", (schema) => {
        return schema.all("users");
      });
    },
  });

  return server;
}
