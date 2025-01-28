import { Flex } from "@radix-ui/themes";
import { ReactElement } from "react";

const SideNav = (): ReactElement => {
  return (
    <Flex
      justify="center"
      height="100%"
      minWidth="50px"
      width="50px"
      className="border-r border-r-neutral-800 bg-neutral-900"
    >
      <Flex pl="2px" width="100%" justify="center">
        {/*<SideNavButton>
          <DesktopIcon height="25px" width="40px" className="self-center text-cyan-400" />
        </SideNavButton>*/}
      </Flex>
    </Flex>
  );
};

export default SideNav;
