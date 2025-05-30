import authRouter from "./auth.routes.js";
import taskRouter from "./task.routes.js";

function allRoutes(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/tasks", taskRouter);
}

export default allRoutes;
