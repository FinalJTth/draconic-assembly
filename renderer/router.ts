import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const memoryHistory = createMemoryHistory({
  initialEntries: ["/"], // Pass your initial url
});

// Create a new router instance
export const router = createRouter({
  routeTree,
  defaultPendingMinMs: 0,
  defaultPreloadStaleTime: 0,
  history: memoryHistory,
});
