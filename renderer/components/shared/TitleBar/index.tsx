import { Flex, Text } from "@radix-ui/themes";
import React from "react";

import { useEffect } from "react";
import MinimizeButton from "./TitleButton";
import TitleButton from "./TitleButton";

const TitleBar = () => {
  const handleMinimize = () => window.electron.windowControls.minimize();
  const handleMaximize = () => window.electron.windowControls.maximize();
  const handleClose = () => window.electron.windowControls.close();

  return (
    <Flex
      id="title-bar"
      justify="between"
      className="fixed left-0 top-0 z-50 flex h-[20px] w-full items-center justify-between overflow-y-hidden"
      style={{
        backgroundColor: "#2f3146",
        WebkitAppRegion: "drag",
      }}
    >
      <Text as="span" id="app-title" size="2" ml="3" weight="bold" color="cyan">
        Draconic Assembly
      </Text>
      <Flex
        id="title-bar-buttons"
        justify="center"
        align="center"
        className="noselect flex"
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

const titleStyles = {
  marginLeft: "10px",
};

export default TitleBar;
