import MainContainer from "@/components/shared/MainContainer";
import TitleBar from "@/components/shared/TitleBar";
import { Theme, ThemePanel } from "@radix-ui/themes";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
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
      <MainContainer className="scroller-transition">
        <Outlet />
      </MainContainer>
      <TanStackRouterDevtools />
    </Theme>
  ),
});
