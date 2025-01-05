import { useEffect, useState } from "react";

const useActiveElement = (): Element | null => {
  const [active, setActive] = useState<Element | null>(document.activeElement);

  const handleFocusIn = (): void => {
    setActive(document.activeElement);
  };

  useEffect(() => {
    document.addEventListener("focusin", handleFocusIn);
    return (): void => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  return active;
};

export default useActiveElement;
