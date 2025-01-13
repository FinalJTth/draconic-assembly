import { useEffect, useState } from "react";

type AsyncFunction<T> = () => Promise<T>;

const AsyncWrap = <T,>(
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

export default AsyncWrap;
