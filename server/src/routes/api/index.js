import user from "./user.js";

export default function configureRoutes(app) {
  app.use("/api/users", user);
}
