import { ChangeEvent, useEffect, useRef, useState } from "react";

type Props = {
  enabled: boolean;
  defaultValue: string;
  onChange: (value: string) => void;
  className?: string;
  maxLength?: number;
};

export default function DynamicInput({
  enabled,
  defaultValue,
  onChange,
  className,
  maxLength,
}: Props) {
  const widthRef = useRef<HTMLSpanElement>(null);
  const [content, setContent] = useState<string>(defaultValue);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (!widthRef.current) {
      return;
    }

    setWidth(widthRef.current.offsetWidth);
  }, [content]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (maxLength && value.length > maxLength) {
      event.preventDefault();
      return;
    }

    setContent(value);
    onChange(value);
  };

  return (
    <div
      className={className}
      style={{
        // need to do this due to some browser extensions messing with input fields
        display: enabled ? "block" : "hidden",
      }}
    >
      <input
        className="outline-none min-w-[10px] text-center bg-transparent"
        value={content}
        type="text"
        style={{
          width,
        }}
        onChange={handleChange}
      />
      <span className="absolute whitespace-pre top-[10000px]" ref={widthRef}>
        {content}
      </span>
    </div>
  );
}
