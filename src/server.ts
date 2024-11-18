import app from "./app";

const port = 3030;

console.log(`Server is running on http://localhost:${port}`);
Bun.serve({
  port,
  hostname: "0.0.0.0",
  fetch(req) {
    return app.fetch(req);
  },
});
