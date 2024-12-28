import "react";

declare module "react" {
  interface CSSProperties {
    WebkitAppRegion?: string;
    WebkitTouchCallout?: string;
    WebkitUserSelect?: string;
  }
}
