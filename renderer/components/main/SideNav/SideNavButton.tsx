import { ReactElement } from "react";

interface SideNavButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SideNavButton = ({ children }: SideNavButtonProps): ReactElement => {
  return (
    <button className="flex h-[50px] w-full justify-center hover:bg-cyan-700 hover:bg-opacity-80">{children}</button>
  );
};

export default SideNavButton;
