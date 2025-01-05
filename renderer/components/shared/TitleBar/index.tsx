import { Flex, Text } from "@radix-ui/themes";
import React from "react";

import TitleButton from "./TitleButton";
import { Link } from "@tanstack/react-router";

const TitleBar = (): React.ReactElement => {
  const handleMinimize = (): void => window.electron.windowControls.minimize();
  const handleMaximize = (): void => window.electron.windowControls.maximize();
  const handleClose = (): void => window.electron.windowControls.close();

  // WebkitAppRegion: "drag",

  return (
    <Flex
      id="title-bar"
      justify="between"
      className="fixed left-0 top-0 z-50 flex h-[20px] w-full items-center justify-between overflow-y-hidden"
      style={{
        backgroundColor: "rgba(25, 37.5, 50)",
      }}
    >
      <Text as="span" id="app-title" size="2" ml="3" weight="bold" color="cyan">
        Draconic Assembly
      </Text>
      <Link to="/main" className="[&.active]:font-bold">
        <Text as="span" id="app-title" size="2" ml="3" weight="bold" color="cyan">
          Main
        </Text>
      </Link>{" "}
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

export default TitleBar;
