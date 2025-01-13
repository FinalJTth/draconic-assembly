import { Button, Container } from "@radix-ui/themes";
import React, { ReactElement, useRef } from "react";

const FilePicker = ({
  className,
  children,
}: Readonly<{ children: React.ReactNode }> & { className?: string }): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnClick = (): void => {
    const input = inputRef.current;

    if (input) {
      console.log(input.files);
    }
  };

  return (
    <Container className={className}>
      <Button onClick={handleOnClick}>{children}</Button>
      <input ref={inputRef} type="file" className="hidden"></input>
    </Container>
  );
};

export default FilePicker;
