import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import "@/styles/global.css";
import { StrictMode } from "react";
import { router } from "./router";

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
