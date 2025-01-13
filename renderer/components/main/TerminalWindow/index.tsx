import { useModels } from "@/stores";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { memo, ReactElement, useEffect, useRef } from "react";

import "@xterm/xterm/css/xterm.css";
import { Uuid } from "../../../../common/types/uuid/index";

const TerminalWindow = (): ReactElement => {
  const { Main } = useModels();

  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal | null>(null);

  const terminalId = Main.getCurrentSession().currentTerminalId;

  useEffect(() => {
    // Handle terminal initiation
    if (!terminal.current) {
      terminal.current = new Terminal({
        fontFamily: "Consolas",
        fontWeight: "100",
        fontSize: 14,
        screenReaderMode: true,
        theme: {
          background: "#171720", //171720
          foreground: "#dddddd",
        },
      });
    }
    const fitAddon = new FitAddon();

    terminal.current.loadAddon(fitAddon);

    terminal.current.open(terminalRef.current!);

    // Handle terminal resizing
    const handleResize = (): void => {
      fitAddon.fit();
      if (terminal.current) {
        const { rows, cols } = terminal.current;
        window.ssh.resizeTerminal(terminalId, { rows, cols });
      }
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResizeWithDelay = (): void => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => handleResize(), 100);
    };

    window.addEventListener("resize", handleResizeWithDelay);

    Main.getCurrentSession()
      .getCurrentTerminal()
      .createNewShellByCurrentSession()
      .then(() => {
        handleResize();
        window.addEventListener("terminalResize", handleResize);
      });

    // Handle terminal IO
    if (terminal.current) {
      terminal.current.onData(async (data) => {
        await window.ssh.sendData(terminalId, data);
      });
    }

    window.ssh.onData((id: Uuid, data) => {
      if (id === terminalId) {
        terminal.current?.write(data);
      }
    });

    window.ssh.onError((id: Uuid, error) => {
      if (id === terminalId) {
        terminal.current?.write(error);
      }
    });
    window.ssh.onStatus((id: Uuid, status) => {
      if (id === terminalId) {
        terminal.current?.write(status);
      }
    });

    return (): void => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("terminalResize", handleResize);
      terminal.current?.dispose();
      terminal.current = null;
      fitAddon.dispose();
    };
  }, [Main.getCurrentSession().currentTerminalId]);

  return (
    <div className="h-full w-full justify-center overflow-hidden bg-[#171720] p-4 pr-2">
      <div
        ref={terminalRef}
        className="block h-full w-full overflow-hidden outline-none"
        style={{ boxSizing: "border-box", position: "relative" }}
      />
    </div>
  );
};

export default memo(TerminalWindow);
