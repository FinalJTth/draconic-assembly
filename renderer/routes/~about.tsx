import { createFileRoute } from "@tanstack/react-router";
import { ReactElement } from "react";

const About = (): ReactElement => {
  return <div className="p-2">Hello from About!</div>;
};

export const Route = createFileRoute("/about")({
  component: About,
});
