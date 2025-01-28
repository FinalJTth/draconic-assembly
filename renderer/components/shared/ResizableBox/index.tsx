import { Direction } from "#/types/layout";
import "@/styles/radix-overrides/index.css";
import { Box } from "@radix-ui/themes";
import React, { ReactElement, useMemo, useRef, useState } from "react";
import EdgeResizer from "../EdgeResizer";

interface ResizerProperty {
  min: number;
  max: number;
  closeOnMin: boolean;
}

interface ResizerLocationTop {
  top: ResizerProperty;
}

interface ResizerLocationBottom {
  bottom: ResizerProperty;
}

interface ResizerLocationLeft {
  left: ResizerProperty;
}

interface ResizerLocationRight {
  right: ResizerProperty;
}

type ResizerLocation = ResizerLocationTop | ResizerLocationBottom | ResizerLocationLeft | ResizerLocationRight;

interface MainContainerProps {
  height?: string;
  width?: string;
  resizer: ResizerLocation;
  children?: React.ReactNode;
}

const ResizableBox = ({ height = "100%", width = "100%", resizer, children }: MainContainerProps): ReactElement => {
  const [boxHeight, setBoxHeight] = useState<number>(-1);
  const [boxWidth, setBoxWidth] = useState<number>(-1);

  const boxRef = useRef<HTMLDivElement>(null);

  const resizerOptions = useMemo<Array<[Direction, ResizerProperty]>>(
    () => Object.entries(resizer) as Array<[Direction, ResizerProperty]>,
    [resizer],
  );

  return (
    <Box
      ref={boxRef}
      height={boxHeight === -1 ? height : `${boxHeight}px`}
      width={boxWidth === -1 ? width : `${boxWidth}px`}
      className="border-r-neutral-800 bg-neutral-900"
      style={{ position: "relative", borderRightWidth: boxWidth === 0 ? "0px" : "1px" }}
    >
      {children}
      {resizerOptions.map((kvp, index) => (
        <EdgeResizer
          key={index}
          targetRef={boxRef}
          min={kvp[1].min}
          max={kvp[1].max}
          closeOnMin={kvp[1].closeOnMin}
          direction={kvp[0]}
          setDimension={kvp[0] === "left" || kvp[0] === "right" ? setBoxWidth : setBoxHeight}
        />
      ))}
    </Box>
  );
};

export default ResizableBox;
