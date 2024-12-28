import { Button, Container } from "@radix-ui/themes";
import React, { useMemo, useRef } from "react";

const DropBox = ({
  className,
  children,
}: Readonly<{ children: React.ReactNode }> & { className?: string }): React.ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnClick = useMemo(
    () => () => {
      const input = inputRef.current;

      if (input) {
        console.log(input.files);
      }
    },
    [],
  );

  return (
    <Container className={className}>
      <Button onClick={handleOnClick}>{children}</Button>
      <input ref={inputRef} type="file" className="hidden"></input>
    </Container>
  );
};

export default DropBox;
