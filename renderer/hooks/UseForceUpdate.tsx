import { useState } from "react";

const useForceUpdate = (): (() => void) => {
  const [_, setValue] = useState(0);
  return () => setValue((value) => value + 1);
};

export default useForceUpdate;
