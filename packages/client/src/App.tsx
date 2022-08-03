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
        message: "Yo World",
        user: "Jeremy",
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
      <button onClick={onAdd}>Add message</button>
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
