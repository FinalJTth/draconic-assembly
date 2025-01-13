import "@/styles/radix-overrides/index.css";
import * as Popover from "@radix-ui/react-popover";
import { Flex } from "@radix-ui/themes";
import { AnimatePresence, motion } from "framer-motion";
import React, { ReactElement } from "react";

interface PopoverErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  message: React.ReactNode | string | undefined;
}

const PopoverError = ({ open, message }: PopoverErrorProps): ReactElement => {
  return (
    <Popover.Root open={open}>
      <Popover.Anchor />
      <Popover.Portal>
        <AnimatePresence>
          <Popover.Content>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scaleX: 0.75, scaleY: 0.75 }}
              transition={{ duration: 0.1 }}
              className="h-full"
            >
              <Flex className="rounded-md bg-rose-800 px-2 py-1 text-sm">{message}</Flex>
              <Popover.Close />
              <Popover.Arrow className="fill-rose-800" />
            </motion.div>
          </Popover.Content>
        </AnimatePresence>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default PopoverError;
