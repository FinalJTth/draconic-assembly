import { Flex, Text } from "@radix-ui/themes";
import React from "react";

interface TerminalWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  width: string;
  height: string;
}

const TerminalWindow = ({ width, height, className, ...rest }: TerminalWindowProps): React.ReactElement => {
  return (
    <Flex direction="column" justify="end" align="start" width={width} height={height} className={className} {...rest}>
      <Text
        as="span"
        size="1"
        weight="bold"
        color="cyan"
        style={{
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
        }}
      >
        test
      </Text>
    </Flex>
  );
};

export default TerminalWindow;
