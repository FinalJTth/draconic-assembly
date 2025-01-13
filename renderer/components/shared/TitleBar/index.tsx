import { Flex, Text } from "@radix-ui/themes";
import { memo, ReactElement } from "react";

import TitleButton from "./TitleButton";
import "/fonts/MorrisRoman-Black.ttf?url";

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
      className={`fixed z-50 overflow-y-hidden border-b border-b-neutral-800 bg-neutral-900`}
      style={{
        WebkitAppRegion: "drag",
        height: height,
      }}
    >
      <Flex direction="row">
        <Flex height="100%" align="center" className="rounded-r-xl border-r border-r-neutral-800 bg-neutral-800">
          <img src="/dragon-cyan.png" className="ml-3 h-[24px] w-[24px]" />
          <Text
            as="span"
            id="app-title"
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
        <Flex direction="row" align="center">
          <Text as="span" size="1" ml="4" color="gray">
            File
          </Text>
          <Text as="span" size="1" ml="5" color="gray">
            Terminal
          </Text>
        </Flex>
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
