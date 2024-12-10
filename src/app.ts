import { Hono } from "hono";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import { serveStatic } from "hono/bun";
import usersRoute from "./routes/users.route";
import resourceRoute from "./routes/resource.route";
import resourceConfigurationRoute from "./routes/resourceConfiguration.route";
import appointmentRoute from "./routes/appointment.route";

const app = new Hono();

// logger middleware
app.use("*", logger());

// routes
// const apiRoutes = app.basePath("/api");
// apiRoutes.route("/", routes);

const routes = app
  .route("/api/users", usersRoute)
  .route("/api/resource", resourceRoute)
  .route("/api/resourceConfiguration", resourceConfigurationRoute)
  .route("/api/appointment", appointmentRoute);

// static files
app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

// error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse();
  }
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
export type AppType = typeof routes;
