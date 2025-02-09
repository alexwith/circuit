export default function Gate() {
  return (
    <svg className="w-25 h-15">
      <path
        className="stroke-violet-500 stroke-[5] fill-none"
        d="M 80 30 L 100 30 M 0 18 L 20 18 M 0 42 L 20 42"
        strokeWidth={5}
      />
      <path
        className="fill-violet-500"
        d="M 20 0 L 50 0 C 66 0 80 13 80 30 C 80 46 66 60 50 60 L 20 60 Z"
      />
    </svg>
  );
}
