import { ChangeEventHandler } from "react";

type Props = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  value?: string;
  className?: string;
};

export default function TextInput({ onChange, value, className }: Props) {
  return (
    <input
      className={`appearance-none focus:outline-none bg-transparent border-1 rounded-md py-1 px-2 ${className}`}
      type="text"
      placeholder="Name"
      value={value}
      onChange={onChange}
    />
  );
}
