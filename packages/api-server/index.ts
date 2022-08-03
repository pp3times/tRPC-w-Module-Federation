import express from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";

interface ChatMessage {
  user: string;
  message: string;
}

const messages: ChatMessage[] = [
  { user: "John", message: "Hello" },
  { user: "Jane", message: "Hi" },
  { user: "John", message: "How are you?" },
  { user: "Jane", message: "I'm fine" },
];

const appRouter = trpc
  .router()
  .query("test", {
    resolve() {
      return "Hello World War III";
    },
  })
  .query("getMessages", {
    input: z.number().default(10),
    resolve({ input }) {
      return messages.slice(-input);
    },
  })
  .mutation("addMessage", {
    input: z.object({
      user: z.string(),
      message: z.string(),
    }),
    resolve({ input }) {
      messages.push(input);
      return input;
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
