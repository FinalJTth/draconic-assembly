import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import "@/styles/global.css";
import { router } from "./router";

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <RouterProvider router={router} />
  </>,
);

postMessage({ payload: "removeLoading" }, "*");
