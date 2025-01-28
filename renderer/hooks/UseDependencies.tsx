import { useEffect } from "react";
import useForceUpdate from "./UseForceUpdate";

/**
 * A custom hook that forces a component to update whenever any of the specified dependencies change.
 *
 * @param {...unknown[]} dependencies - A rest parameter of dependencies that will trigger the component
 * to re-render when they change.
 */
const useDependencies = (...dependencies: unknown[]): void => {
  const forceUpdate = useForceUpdate();
  useEffect(() => forceUpdate(), dependencies);
};

export default useDependencies;
