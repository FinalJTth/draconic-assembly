import ExplorerPanel from "@/components/main/ExplorerPanel";
import SideNav from "@/components/main/SideNav";
import Terminal from "@/components/main/TerminalWindow";
import MainBox from "@/components/shared/MainBox";
import useRenderDependency from "@/hooks/UseRenderDependency";
import { useModels } from "@/stores";
import { DEFAULT_UUID } from "@/utils/uuid";
import { Box, Flex } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { ReactElement, useEffect } from "react";

const Main = (): ReactElement => {
  const { Main } = useModels();

  useRenderDependency(Main.getCurrentSession().currentTerminalId);

  useEffect(() => {
    Main.getCurrentSession().setCurrentTerminal(Main.getCurrentSession().newTerminal());
  }, []);

  return (
    <MainBox className="h-full">
      <Flex height="100%" align="end">
        <SideNav />
        <Box height="100%">
          <ExplorerPanel />
        </Box>
        {Main.getCurrentSession().currentTerminalId !== DEFAULT_UUID ? <Terminal /> : <></>}
      </Flex>
    </MainBox>
  );
};

export const Route = createFileRoute("/main")({
  component: Main,
});
