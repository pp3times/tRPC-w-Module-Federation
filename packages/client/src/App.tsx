import React, { useState } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import "./index.scss";
import { trpc } from "./trpc";

const client = new QueryClient();

const AppContent = () => {
  const test = trpc.useQuery(["test"]);
  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      <div>{JSON.stringify(test.data)}</div>
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
