import { useState } from "react";

/**
 * Returns a function that when called, will trigger a rerender of the component
 * where this hook is used. This is useful when you want to force a component to
 * update when some external state has changed, but you don't have a prop to
 * re-render the component.
 *
 * @returns {function} A function that will force a rerender of the component
 *   when called.
 */
const useForceUpdate = (): (() => void) => {
  const [_, setValue] = useState(0);
  return () => setValue((value) => value + 1);
};

export default useForceUpdate;
