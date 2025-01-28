import useDependencies from "@/hooks/UseDependencies";
import { motion } from "framer-motion";
import React, { memo, ReactElement, RefObject } from "react";

type Direction = "top" | "bottom" | "left" | "right";

interface EdgeResizerProps {
  targetRef: RefObject<HTMLDivElement | null>;
  min: number;
  max: number;
  closeOnMin: boolean;
  closeThreshHold?: number;
  direction: Direction;
  setDimension: (_: number) => void;
}

const EdgeResizer = ({
  targetRef,
  min,
  max,
  closeOnMin,
  closeThreshHold = 75,
  direction,
  setDimension,
}: EdgeResizerProps): ReactElement => {
  useDependencies(targetRef.current);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    const startX = e.clientX;
    const startWidth = targetRef.current?.clientWidth;

    let resizeTimeout: NodeJS.Timeout;

    const onMouseMove = (e: MouseEvent): void => {
      const newWidth = (startWidth as number) + (e.clientX - startX);
      if (closeOnMin && newWidth <= closeThreshHold) {
        setDimension(0);
      } else {
        setDimension(Math.min(max, Math.max(min, newWidth)));
      }

      // Dispatch terminal resizing.
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        window.dispatchEvent(new CustomEvent("terminalResize"));
      }, 100);
    };

    const onMouseUp = (): void => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const position =
    direction === "top"
      ? { left: 0, top: 0, right: 0 }
      : direction === "bottom"
        ? { left: 0, bottom: 0, right: 0 }
        : direction === "left"
          ? { bottom: 0, left: 0, top: 0 }
          : direction === "right"
            ? { top: 0, right: 0, bottom: 0 }
            : {};

  return targetRef.current ? (
    <motion.div
      className="w-1 cursor-col-resize"
      style={{ position: "absolute", ...position }}
      whileHover={{ backgroundColor: "#06b6d4" }}
      transition={{ duration: 0.4, delay: 0.25 }}
      onMouseDown={handleMouseDown}
    />
  ) : (
    <></>
  );
};

export default memo(EdgeResizer);
