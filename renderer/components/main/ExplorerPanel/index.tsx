import ResizableBox from "@/components/shared/ResizableBox";
import { ReactElement } from "react";

const ExplorerPanel = (): ReactElement => {
  return (
    <ResizableBox
      width="300px"
      resizer={{
        right: {
          min: 150,
          max: 1500,
          closeOnMin: true,
        },
      }}
    ></ResizableBox>
  );
};

export default ExplorerPanel;
