import { Flex, Text } from "@radix-ui/themes";
import { memo, ReactElement } from "react";

import "@/assets/fonts/MorrisRoman-Black.ttf?url";
import TitleButton from "./TitleButton";
import TitleNameBox from "./TitleNameBox";

interface TitleBarProps {
  height: string;
}

const TitleBar = ({ height }: TitleBarProps): ReactElement => {
  const handleMinimize = (): void => window.renderer.minimize();
  const handleMaximize = (): void => window.renderer.maximize();
  const handleClose = (): void => window.renderer.close();

  return (
    <Flex
      justify="between"
      align="center"
      width="100%"
      position="fixed"
      top="0"
      left="0"
      className="z-50 select-none overflow-y-hidden border-b border-b-neutral-800 bg-neutral-900"
      style={{
        height,
      }}
    >
      <Flex direction="row">
        <TitleNameBox />
        <Flex direction="row" align="center">
          <Text as="span" size="1" ml="4" color="gray">
            File
          </Text>
          <Text as="span" size="1" ml="5" mr="3" color="gray">
            Terminal
          </Text>
        </Flex>
      </Flex>
      <Flex
        flexGrow="1"
        style={{
          WebkitAppRegion: "drag",
        }}
      >
        &nbsp;
      </Flex>
      <Flex
        justify="center"
        align="center"
        height="100%"
        className="noselect"
        style={{
          WebkitAppRegion: "no-drag",
        }}
      >
        <TitleButton onClick={handleMinimize}>━</TitleButton>
        <TitleButton size="3" onClick={handleMaximize}>
          ⛶
        </TitleButton>
        <TitleButton size="4" weight="bold" onClick={handleClose}>
          ×
        </TitleButton>
      </Flex>
    </Flex>
  );
};

export default memo(TitleBar);
