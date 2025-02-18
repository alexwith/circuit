import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  onClick: () => void;
};

export default function ControlButton({ onClick, icon }: Props) {
  return (
    <div
      className="p-1 hover:bg-light dark:hover:bg-light-dark rounded-sm hover:cursor-pointer hover:text-violet-400"
      onClick={onClick}
    >
      {icon}
    </div>
  );
}
