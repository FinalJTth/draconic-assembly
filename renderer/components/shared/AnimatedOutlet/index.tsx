import { getRouterContext, Outlet, useRouterState } from "@tanstack/react-router";
import { motion, useIsPresent } from "framer-motion";
import { cloneDeep } from "lodash";
import { ReactElement, Ref, useContext, useRef } from "react";

interface AnimatedOutletProps {
  ref: Ref<HTMLDivElement> | undefined;
}

const AnimatedOutlet = ({ ref }: AnimatedOutletProps): ReactElement => {
  const RouterContext = getRouterContext();
  const routerContext = useContext(RouterContext);
  const renderedContext = useRef(routerContext);

  const isPresent = useIsPresent();

  if (isPresent) {
    renderedContext.current = cloneDeep(routerContext);
  }

  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: currentPath === "/" ? 0 : -1200 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 1200 }}
      transition={{ duration: 0.5, ease: "circInOut" }}
      className="h-full"
    >
      <RouterContext.Provider value={renderedContext.current}>
        <Outlet />
      </RouterContext.Provider>
    </motion.div>
  );
};

export default AnimatedOutlet;
