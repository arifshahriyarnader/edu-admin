import user from "./user.js";
import teacher from "./teacher.js";

export default function configureRoutes(app) {
  app.use("/api/users", user);
  app.use("/api/teacher", teacher);
}
