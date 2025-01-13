import { Flex, Text, TextProps } from "@radix-ui/themes";
import React, { ReactElement } from "react";

interface TitleButtonProps {
  children: Readonly<React.ReactNode>;
}

const TitleButton = ({ children, ...props }: TextProps | TitleButtonProps): ReactElement => {
  return (
    <Flex
      justify="center"
      align="center"
      height="100%"
      width="30px"
      className={
        "cursor-pointer hover:bg-opacity-80" +
        (children && children?.toString() === "×" ? " hover:bg-red-700" : " hover:bg-cyan-700")
      }
    >
      <Text
        as="span"
        size="1"
        weight="bold"
        color="cyan"
        style={{
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
        }}
        {...props}
      >
        {children}
      </Text>
    </Flex>
  );
};

export default TitleButton;
