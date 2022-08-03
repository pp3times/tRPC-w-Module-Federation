import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  QueryClient,
  QueryClientProvider,
  invalidateQueries,
} from "react-query";

import "./index.scss";
import { trpc } from "./trpc";

const client = new QueryClient();

const AppContent = () => {
  const getMessages = trpc.useQuery(["getMessages"]);

  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  const addMessage = trpc.useMutation(["addMessage"]);
  const onAdd = () => {
    addMessage.mutate(
      {
        message,
        user,
      },
      {
        onSuccess: () => {
          client.invalidateQueries(["getMessages"]);
        },
      }
    );
  };
  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      <div>{JSON.stringify(getMessages.data)}</div>
      <div className="mt-10 space-x-2 flex items-center ">
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="p-5 border-2 border-gray-300 rounded-md w-1/2 outline-none focus:ring-2"
          placeholder="user"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-5 border-2 border-gray-300 rounded-md w-1/2 outline-none focus:ring-2"
          placeholder="message"
        />
      </div>
      <button
        className="w-full p-5 text-center bg-blue-500 rounded-md mt-10 text-white font-bold"
        onClick={onAdd}
      >
        Add message
      </button>
    </div>
  );
};

const App = () => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: "http://localhost:8080/api",
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client} contextSharing={true}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
