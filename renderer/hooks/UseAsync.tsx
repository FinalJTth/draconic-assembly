import { useEffect, useState } from "react";

type AsyncFunction<T> = () => Promise<T>;

/**
 * A custom React hook that executes an asynchronous function and returns its result.
 *
 * @param asyncFunc - The asynchronous function to execute. It returns a promise.
 * @param defaultValue - An optional default value to return if the promise hasn't resolved.
 * @param dependencies - An array of dependencies for the useEffect hook. The async function is re-invoked
 * whenever any of these dependencies change.
 * @returns The resolved value of the async function, or the default value if the result is undefined.
 */
const useAsync = <T,>(
  asyncFunc: AsyncFunction<T>,
  defaultValue?: T,
  dependencies: Array<unknown> = [],
): T | undefined => {
  const [output, setOutput] = useState<T>();

  useEffect(() => {
    asyncFunc().then((val) => setOutput(val));
  }, dependencies);

  return output === undefined ? defaultValue : output;
};

export default useAsync;
