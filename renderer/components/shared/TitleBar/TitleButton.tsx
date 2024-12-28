import { Box, Button, Flex, Text, TextProps } from "@radix-ui/themes";
import React from "react";

import { useEffect } from "react";

interface TitleButtonProps {
  children: Readonly<React.ReactNode>;
}

const TitleButton = ({ children, ...props }: TextProps | TitleButtonProps) => {
  return (
    <Flex
      justify="center"
      width="30px"
      pt="1px"
      className={
        "cursor-pointer hover:bg-opacity-80" +
        (children && children?.toString() === "×" ? " hover:bg-red-700" : " hover:bg-indigo-700")
      }
    >
      <Text
        as="span"
        size="1"
        weight="bold"
        color="indigo"
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
