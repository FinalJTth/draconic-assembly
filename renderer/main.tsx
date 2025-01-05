import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import "./styles/global.css";
import "@radix-ui/themes/styles.css";

const memoryHistory = createMemoryHistory({
  initialEntries: ["/"], // Pass your initial url
});

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPendingMinMs: 0,
  defaultPreloadStaleTime: 0,
  history: memoryHistory,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

postMessage({ payload: "removeLoading" }, "*");
