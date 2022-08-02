import express from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";

const appRouter = trpc.router().query("test", {
  resolve() {
    return "Hello World";
  },
});

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
const port = 8080;

app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => null,
  })
);

app.get("/", (req, res) => {
  res.send("Hello from api-server");
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
