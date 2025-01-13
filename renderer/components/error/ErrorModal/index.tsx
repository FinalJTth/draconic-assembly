import * as Dialog from "@radix-ui/react-dialog";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { Button, Flex, Text } from "@radix-ui/themes";
import { ReactElement } from "react";

interface ErrorModalProps {
  error: Error | null;
  resetErrorBoundary: () => void;
}

const ErrorModal = ({ error, resetErrorBoundary }: ErrorModalProps): ReactElement =>
  error !== null ? (
    <Dialog.Root modal={false} open={!!error}>
      <Dialog.Portal container={document.getElementById("error-root")}>
        <Dialog.Overlay className="pointer-events-none fixed inset-0 z-10 bg-black/50" />
        <FocusScope trapped={false}>
          <Dialog.Content
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
            className="fixed left-full top-full z-20 w-[500px] -translate-x-full -translate-y-full"
          >
            <Flex
              p="4"
              justify="between"
              className="select-none rounded-xl border border-rose-900 bg-rose-950 outline-none"
            >
              <Flex direction="column">
                <Dialog.Title>
                  <Text size="4" weight="bold">
                    An unanticipated error has occurred
                  </Text>
                </Dialog.Title>
                <Dialog.Description className="mt-0">
                  <Text size="2" weight="regular" color="gray">
                    {error.message}
                  </Text>
                </Dialog.Description>
              </Flex>
              <div className="mt-4 flex justify-end">
                <Button color="crimson" variant="surface" onClick={resetErrorBoundary} className="">
                  Dismiss
                </Button>
              </div>
            </Flex>
          </Dialog.Content>
        </FocusScope>
      </Dialog.Portal>
    </Dialog.Root>
  ) : (
    <></>
  );

export default ErrorModal;
