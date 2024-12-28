import { Container } from "@radix-ui/themes";
import React from "react";

interface MainContainerProps {
  className?: string;
  children: React.ReactNode;
}

const MainContainer = ({ className, children }: MainContainerProps): React.ReactElement => {
  return (
    <Container width="100%" className={className}>
      {children}
    </Container>
  );
};

export default MainContainer;
