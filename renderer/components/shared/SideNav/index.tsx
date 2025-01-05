import { DesktopIcon } from "@radix-ui/react-icons";
import { Button, Flex, Text } from "@radix-ui/themes";

const SideNav = (): React.ReactElement => {
  return (
    <Flex width="65px" justify="center" className="bg-slate-900 h-[calc(100vh-20px)]">
      <Flex gap="3" mt="3">
        <Button variant="ghost">
          <Flex align="center" direction="column">
            <DesktopIcon height="35" width="35px" />
            <Text
              size="1"
              weight="medium"
              style={{
                fontSize: "0.75rem",
                lineHeight: "1rem",
                marginTop: "2px",
              }}
            >
              Terminal
            </Text>
          </Flex>
        </Button>
      </Flex>
    </Flex>
  );
};

export default SideNav;
