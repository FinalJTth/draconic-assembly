import { createFileRoute } from "@tanstack/react-router";
import MainContainer from "@/components/shared/MainContainer";
import { Flex } from "@radix-ui/themes";
import SideNav from "@/components/shared/SideNav";
import Terminal from "@/components/TerminalWindow";

const Main = (): React.ReactElement => {
  return (
    <MainContainer>
      <Flex align="end">
        <SideNav />
        <Terminal width="100%" height="100%" />
      </Flex>
    </MainContainer>
  );
};

export const Route = createFileRoute("/main")({
  component: Main,
});
