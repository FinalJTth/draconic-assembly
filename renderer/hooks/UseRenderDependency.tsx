import { useEffect } from "react";
import useForceUpdate from "./UseForceUpdate";

const useRenderDependency = (...dependencies: unknown[]): void => {
  const forceUpdate = useForceUpdate();
  useEffect(() => forceUpdate(), dependencies);
};

export default useRenderDependency;
