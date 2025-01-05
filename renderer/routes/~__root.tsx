import TitleBar from "@/components/shared/TitleBar";
import { Theme, ThemePanel } from "@radix-ui/themes";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import React from "react";

const Root = (): React.ReactElement => {
  return (
    <Theme appearance="dark" accentColor="cyan" grayColor="mauve">
      <ThemePanel />
      <TitleBar />
      <div className="flex gap-2 py-[10px]">
        {/*
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link> 
      <Link to="/app" className="[&.active]:font-bold">
        App
      </Link>
        */}
      </div>
      <div className="scroller-transition">
        <Outlet />
      </div>
      {/*<TanStackRouterDevtools />*/}
    </Theme>
  );
};

export const Route = createRootRoute({
  component: Root,
});
