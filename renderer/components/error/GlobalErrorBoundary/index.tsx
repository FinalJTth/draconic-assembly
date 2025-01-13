import React, { ReactElement, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorModal from "../ErrorModal";

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

const GlobalErrorBoundary = ({ children }: GlobalErrorBoundaryProps): ReactElement => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent): void => {
      setError(event.error || new Error(event.message));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
      setError(event.reason || new Error("Unhandled promise rejection"));
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return (): void => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);
  return (
    <>
      <ErrorModal error={error} resetErrorBoundary={() => setError(null)} />
      <ErrorBoundary FallbackComponent={ErrorModal}>{children}</ErrorBoundary>
    </>
  );
};

export default GlobalErrorBoundary;
