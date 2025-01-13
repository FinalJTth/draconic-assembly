import "@/styles/radix-overrides/index.css";
import { Box } from "@radix-ui/themes";
import React, { ReactElement } from "react";

interface MainContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const MainBox = ({ className, children, ...rest }: MainContainerProps): ReactElement => {
  return (
    <Box tabIndex={-1} width="100%" className={`${className} outline-none select-none`} {...rest}>
      {children}
    </Box>
  );
};

export default MainBox;
