import AppIcon from "@/assets/icons/dragon-cyan.png";
import { Flex, Text } from "@radix-ui/themes";
import { ReactElement } from "react";

const TitleNameBox = (): ReactElement => {
  return (
    <Flex height="100%" align="center" className="rounded-r-xl border-r border-r-neutral-800 bg-neutral-800">
      <img src={AppIcon} height={"24px"} width={"24px"} className="ml-3 h-[24px] w-[24px]" />
      <Text
        as="span"
        size="5"
        ml="3"
        mr="4"
        weight="bold"
        color="cyan"
        style={{
          fontFamily: "MorrisRoman",
        }}
      >
        Azure Flow
      </Text>
    </Flex>
  );
};

export default TitleNameBox;
