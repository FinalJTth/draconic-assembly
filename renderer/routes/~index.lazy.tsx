import { SshConfig } from "#/types/ssh";
import MainBox from "@/components/shared/MainBox";
import PopoverError from "@/components/shared/PopoverError";
import { SecretType, SshConfigForm, sshConfigFormSchema } from "@/form_schemas/ssh_config";
import { useModels } from "@/stores";
import "@/styles/starry/index.css";
import { generateUuidV1 } from "@/utils/uuid";
import AsyncWrap from "@/utils/wrappers/async";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlusIcon } from "@radix-ui/react-icons";
import { Box, Button, Card, Container, Flex, RadioCards, Text, TextField } from "@radix-ui/themes";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import React, { ReactElement, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface RippleEffect {
  x: number;
  y: number;
  size: number;
  id: string;
}

const Index = (): ReactElement => {
  const { Main } = useModels();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<SshConfigForm>({
    defaultValues: {
      host: "34.142.196.203",
      port: 22,
      secretType: SecretType.PrivateKeyPassphrase,
      username: "zenesta",
      secret: "Furfinalize1",
      keyPath: "F:\\Project\\Cloud Computing\\sshkey\\id_rsa",
    },
    resolver: zodResolver(sshConfigFormSchema),
  });

  const [isConnecting, setIsConnection] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  /*
  const handleConnect = async (config: SshConfig): Promise<void> => {
    setIsConnection(true);

    const response = await window.ssh.startSsh(config);

    setIsConnection(false);

    if (response.success) {
      console.log("Connected successfully");
      router.navigate({
        to: "/main",
      });
    } else {
      console.error("Connection failed:", response.message);
      if (response.message.includes("bad passphrase")) {
        setError("secret", { type: "manual", message: "Bad passphrase" });
      }
      if (response.message.includes("All configured authentication methods failed")) {
        console.log("test");
        setCustomError("Either username doesn't exist or invalid key");
      }
    }
  };
  */

  const handleSelectKey = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

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

  /*
  const handleExecute = async (): Promise<void> => {
    const response = await window.ssh.execute("ufw");
    console.log(response);
    if (response.success && response.result) {
      console.log(response.result.output);
    } else {
      console.error("Command execution failed:", response.message);
    }
  };
  */

  const onSubmit: SubmitHandler<SshConfigForm> = async (data): Promise<void> => {
    setCustomError("");

    const config: SshConfig = { host: data.host, port: data.port, username: data.username };
    if (data.secretType !== SecretType.Password) {
      config["keyPath"] = data.keyPath;
    }

    if (data.secretType === SecretType.PrivateKeyPassphrase || data.secretType === SecretType.Password) {
      config["secret"] = data.secret;
    }

    console.log(config);
    setIsConnection(true);
    const validationPayload = await window.ssh.validateConfig(config);
    setIsConnection(false);
    if (validationPayload.result) {
      const isSuccessful = validationPayload.result.isSuccessful;
      if (isSuccessful) {
        const id = generateUuidV1();
        Main.newSession({
          id,
          ...config,
        });
        Main.setCurrentSession(id);

        router.navigate({
          to: "/main",
        });
      } else {
        const error = validationPayload.result.error;
        console.error("Connection failed:", error.message);
        if (error.message.includes("bad passphrase")) {
          console.error(error.message);
          setError("secret", { type: "manual", message: "Bad passphrase." });
        } else if (error.message.includes("All configured authentication methods failed")) {
          setCustomError("Either username doesn't exist or invalid key.");
        } else if (error.message.includes("getaddrinfo ENOTFOUND")) {
          setCustomError("Cannot resolve IP Address or domain name.");
        } else if (error.message.includes("Timed out")) {
          setCustomError("Timed out while trying to connect to remote host.");
        } else {
          setCustomError(error.message);
        }
      }
    }
  };

  const handleSubmitButton = (): void => {
    formRef.current?.requestSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): boolean => {
    if (e.key === "Enter") {
      e.preventDefault();
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
      <motion.div
        animate={{
          opacity: 1,
        }}
        initial={{ opacity: 0, x: 300, scale: 1.5 }}
        transition={{
          opacity: { duration: 2.5, delay: 0.75 }, // Fade-in duration
        }}
        className=""
      >
        <div id="stars" className="w-full" />
        <div id="stars2" className="w-full" />
        <div id="stars3" className="w-full" />
      </motion.div>
      <MainBox onKeyDown={handleKeyDown} onMouseDown={() => setCustomError("")}>
        <Flex direction="column" justify="center" align="center" className="h-screen">
          <motion.div
            layout
            className="w-[350px]"
            animate={{
              opacity: 1, // Animate fade-in
            }}
            initial={{ opacity: 0 }} // Start with opacity 0 (hidden)
            transition={{
              opacity: { duration: 0.5, delay: 0.25 }, // Fade-in duration
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
                        <TextField.Root type="text" placeholder="22" {...field} />
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
                          columns={{ initial: "3" }}
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
                              placeholder={AsyncWrap<string>(async () => {
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
                              <TextField.Slot className="w-[1px]" />
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
                          render={({ field }) => (
                            <>
                              <TextField.Root type="password" placeholder={secretName} {...field} />
                            </>
                          )}
                        />
                      </motion.div>
                    ) : (
                      <></>
                    )}
                  </AnimatePresence>
                </Container>
              </form>
              <Flex direction="column" mt="7" justify="center">
                <Button variant="surface" onClick={handleSubmitButton} loading={isConnecting}>
                  Connect & Start
                </Button>
                <PopoverError
                  open={Object.entries(errors).length !== 0}
                  message={Object.entries(errors).map((entry, index) => {
                    return (
                      <Text
                        key={index}
                      >{`${String(entry[0][0]).toUpperCase() + String(entry[0]).slice(1)} : ${entry[1].message}`}</Text>
                    );
                  })}
                />
                <PopoverError open={customError.length !== 0} message={customError} />
              </Flex>
              {/*<Flex direction="column">
                {Object.entries(errors).map((entry, index) => {
                  return <Text key={index}>{entry[0] + ":" + entry[1].type + ":" + entry[1].message}</Text>;
                })}
              </Flex>*/}
            </Card>
          </motion.div>
        </Flex>
      </MainBox>
    </>
  );
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});
