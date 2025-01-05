import { Box, Button, Card, Container, Flex, RadioCards, Text, TextField } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";
import { SshConfig } from "../../electron/classes/ssh";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SecretType, SshConfigForm, sshConfigSchema } from "@/form_schemas/ssh_config";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FilePlusIcon } from "@radix-ui/react-icons";
import "../styles/starry/index.css";
import Async from "@/utils/wrappers/async";
import MainContainer from "@/components/shared/MainContainer";
import useActiveElement from "@/hooks/UseActiveElement";

interface RippleEffect {
  x: number;
  y: number;
  size: number;
  id: string;
}

const Index = (): React.ReactElement => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SshConfigForm>({
    defaultValues: {
      host: "",
      port: 22,
      secretType: SecretType.PrivateKey,
      username: "",
      secret: "",
      keyPath: "",
    },
    resolver: zodResolver(sshConfigSchema),
  });

  const [isConnecting, setIsConnection] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);

  const focusedElement = useActiveElement();

  const handleConnect = async (config: SshConfigForm): Promise<void> => {
    setIsConnection(true);

    const response = await window.ssh.connect(config);

    setIsConnection(false);

    if (response.success) {
      console.log("Connected successfully");
    } else {
      console.error("Connection failed:", response.message);
    }
  };

  const handleSelectKey = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    console.log(e.target);

    const response = await window.utils.selectFile();
    if (response.success && response.message === "Selection canceled.") {
      console.log("Key selection canceled.");
    } else if (response.success) {
      console.log("Key selection is successful.");
      setValue("keyPath", response.result);
    } else {
      console.error("Key selection has failed:", response.message);
    }
  };

  const handleExecute = async (): Promise<void> => {
    const response = await window.ssh.execute("ufw");
    console.log(response);
    if (response.success && response.result) {
      console.log(response.result.output);
    } else {
      console.error("Command execution failed:", response.message);
    }
  };

  const onSubmit: SubmitHandler<SshConfigForm> = async (data) => {
    console.log(data);

    const config: SshConfig = { host: data.host, port: data.port, username: data.username };
    if (data.secretType !== SecretType.Password) {
      config["keyPath"] = data.keyPath;
    }

    if (data.secretType === SecretType.PrivateKeyPassphrase) {
      config["passphrase"] = data.secret;
    } else if (data.secretType === SecretType.Password) {
      config["password"] = data.secret;
    }

    await handleConnect(data);
  };

  const handleSubmitButton = (): void => {
    formRef.current?.requestSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): boolean => {
    e.preventDefault();

    if (e.key === "Enter") {
      formRef.current?.requestSubmit();
    }

    return false;
  };

  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  const handleClickRipple = (e: React.PointerEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Math.random().toString(36).substring(2, 9); // Generate unique ID for the ripple

    setRipples((prevRipples) => [...prevRipples, { x, y, size, id }]);

    // Remove the ripple after animation is complete
    setTimeout(() => {
      setRipples((prevRipples) => prevRipples.filter((r) => r.id !== id));
    }, 1000);
  };

  const secretName = watch("secretType") === SecretType.PrivateKeyPassphrase ? "Passphrase" : "Password";

  return (
    <>
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />
      <MainContainer onKeyDown={handleKeyDown}>
        <Flex direction="column" justify="center" align="center" className="h-screen">
          <AnimatePresence>
            <motion.div
              layout
              className="w-[350px]"
              animate={{
                opacity: 1, // Animate fade-in
              }}
              initial={{ opacity: 0 }} // Start with opacity 0 (hidden)
              transition={{
                opacity: { duration: 0.5 }, // Fade-in duration
                layout: { duration: 0.25 }, // Layout change duration
                staggerChildren: 0.2,
              }}
            >
              <Card size="3" onPointerDown={handleClickRipple}>
                {ripples.map(({ x, y, size, id }) => (
                  <motion.span
                    key={id}
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      left: x,
                      top: y,
                      width: size,
                      height: size,
                      backgroundColor: "rgba(150, 175, 255, 0.1)",
                      borderRadius: "50%",
                      pointerEvents: "none",
                    }}
                  />
                ))}
                <Flex direction="column">
                  <Text size="7" weight="medium">
                    Get Started
                  </Text>
                  <Text size="2" color="gray">
                    By connecting to your server
                  </Text>
                </Flex>
                <form ref={formRef} className="mt-5 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                  <Flex>
                    <Controller
                      name="host"
                      control={control}
                      render={({ field }) => (
                        <Flex direction="column" flexGrow="1">
                          <Text weight="medium" ml="2">
                            Host
                          </Text>
                          <TextField.Root type="text" placeholder="127.0.0.1 / example.domain.com" {...field} />
                        </Flex>
                      )}
                    />
                    <Controller
                      name="port"
                      control={control}
                      render={({ field }) => (
                        <Flex direction="column" width="26%" justify="between">
                          <Text weight="medium" ml="2">
                            Port
                          </Text>
                          <TextField.Root type="number" placeholder="Port" {...field} />
                        </Flex>
                      )}
                    />
                  </Flex>

                  <Text weight="medium" ml="2" mt="3">
                    Username
                  </Text>
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => <TextField.Root type="text" placeholder="root" {...field} />}
                  />
                  <Text weight="medium" ml="2" mt="3">
                    Secret
                  </Text>
                  <Controller
                    name="secretType"
                    control={control}
                    render={({ field }) => (
                      <Flex direction="column">
                        <Box>
                          <RadioCards.Root
                            gap="0"
                            defaultValue="1"
                            columns={{ initial: "1", sm: "3" }}
                            onValueChange={field.onChange}
                            {...field}
                          >
                            <RadioCards.Item value={SecretType.PrivateKey}>
                              <Flex direction="column" width="100%">
                                <Text weight="bold">P-Key</Text>
                                <Text size="1">Alone</Text>
                              </Flex>
                            </RadioCards.Item>
                            <RadioCards.Item value={SecretType.PrivateKeyPassphrase}>
                              <Flex direction="column" width="100%">
                                <Text weight="bold">P-Key &</Text>
                                <Text size="1">Passphrase</Text>
                              </Flex>
                            </RadioCards.Item>
                            <RadioCards.Item value={SecretType.Password}>
                              <Flex direction="column" width="100%">
                                <Text weight="bold">Password</Text>
                                <Text size="1">Please don't</Text>
                              </Flex>
                            </RadioCards.Item>
                          </RadioCards.Root>
                        </Box>
                      </Flex>
                    )}
                  />
                  <Container mt="3">
                    <AnimatePresence>
                      {watch("secretType") !== SecretType.Password ? (
                        <motion.div
                          key="content1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "32px" }} // Fade-in effect for new content
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <Controller
                            name="keyPath"
                            control={control}
                            render={({ field }) => (
                              <TextField.Root
                                type="text"
                                placeholder={Async<string>(async () => {
                                  const platform = await window.utils.getPlatform().then((res) => res.result);
                                  if (platform) {
                                    if (platform === "win32") {
                                      return "C:\\Users\\Example\\.ssh\\key";
                                    } else if (platform === "linux") {
                                      return "~/.ssh/key";
                                    }
                                  }

                                  return "Private key";
                                })}
                                {...field}
                              >
                                <TextField.Slot>
                                  <Button variant="soft" ml="-2" onClick={handleSelectKey}>
                                    <FilePlusIcon height="22" width="22px" color="#AAAABC" />
                                    Select
                                  </Button>
                                </TextField.Slot>
                              </TextField.Root>
                            )}
                          />
                        </motion.div>
                      ) : (
                        <></>
                      )}
                      {watch("secretType") !== SecretType.PrivateKey ? (
                        <motion.div
                          key="content2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "32px" }} // Fade-in effect for new content
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <Controller
                            name="secret"
                            control={control}
                            render={({ field }) => <TextField.Root type="text" placeholder={secretName} {...field} />}
                          />
                        </motion.div>
                      ) : (
                        <></>
                      )}
                    </AnimatePresence>
                  </Container>
                </form>
                <Flex mt="6" justify="center">
                  <Button variant="surface" onClick={handleSubmitButton} loading={isConnecting}>
                    Connect & Start
                  </Button>
                </Flex>
                {/*<Flex direction="column">
      {Object.entries(errors).map((entry, index) => {
        return <Text key={index}>{entry[0] + ":" + entry[1].type + ":" + entry[1].message}</Text>;
      })}
    </Flex>*/}
              </Card>
            </motion.div>
          </AnimatePresence>
        </Flex>
      </MainContainer>
    </>
  );
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});
