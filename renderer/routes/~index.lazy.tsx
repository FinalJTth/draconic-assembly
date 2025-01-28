import SshFormCard from "@/components/routes/index/SshFormCard";
import MainBox from "@/components/shared/MainBox";
import "@/styles/starry/index.css";
import { Flex } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ReactElement } from "react";

const Index = (): ReactElement => {
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
      <MainBox>
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
            <SshFormCard />
          </motion.div>
        </Flex>
      </MainBox>
    </>
  );
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});
