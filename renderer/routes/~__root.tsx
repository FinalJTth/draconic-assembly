import TitleBar from "@/components/shared/TitleBar";
import { Theme } from "@radix-ui/themes";
import { createRootRoute, useMatch, useMatches } from "@tanstack/react-router";
import { ReactElement, useEffect, useRef } from "react";

import GlobalErrorBoundary from "@/components/error/GlobalErrorBoundary";
import "@radix-ui/themes/styles.css";
import { AnimatePresence } from "framer-motion";

import AnimatedOutlet from "@/components/shared/AnimatedOutlet";

const Root = (): ReactElement => {
  const matches = useMatches();
  const match = useMatch({ strict: false });
  const nextMatchIndex = matches.findIndex((d) => d.id === match.id) + 1;
  const nextMatch = matches[nextMatchIndex];

  const displayRef = useRef<HTMLDivElement>(null);

  const titleBarHeight = "30px";

  useEffect(() => {
    window.startup.reactReady();
  }, []);

  return (
    <Theme appearance="dark" accentColor="cyan" grayColor="mauve">
      {/*<ThemePanel />*/}
      {/*<TanStackRouterDevtools />*/}
      <TitleBar height={titleBarHeight} />
      <div className="flex gap-2" style={{ paddingTop: titleBarHeight }}>
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
      <div
        ref={displayRef}
        id="error-root"
        className="scroller-transition"
        style={{
          height: `calc(100vh - ${titleBarHeight})`,
        }}
      >
        <GlobalErrorBoundary>
          <AnimatePresence mode="popLayout">
            <AnimatedOutlet key={nextMatch.id} />
          </AnimatePresence>
        </GlobalErrorBoundary>
      </div>
    </Theme>
  );
};

export const Route = createRootRoute({
  component: Root,
});
