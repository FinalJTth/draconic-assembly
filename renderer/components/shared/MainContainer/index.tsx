import { Container } from "@radix-ui/themes";
import React from "react";
import "@/styles/radix-overrides/index.css";

interface MainContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const MainContainer = ({ className, children, ...rest }: MainContainerProps): React.ReactElement => {
  return (
    <Container tabIndex={-1} width="100%" className={`${className} outline-none select-none`} {...rest}>
      {children}
    </Container>
  );
};

export default MainContainer;
