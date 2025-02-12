import { GateTypeEntity } from "../entities/other/GateTypeEntity";

export const basicLogicGates: GateTypeEntity[] = [
  {
    name: "NAND",
    inputs: 2,
    outputs: 1,
    truthTable: {
      "00": "1",
      "01": "1",
      "10": "1",
      "11": "0",
    },
    width: 90,
    height: 60,
    icon: (
      <>
        <path
          className="stroke-violet-500 stroke-[5] fill-none"
          d="M 74 30 L 90 30 M 0 15 L 16 15 M 0 45 L 16 45"
        />
        <path
          className="fill-violet-500"
          d="M 15 0 L 45 0 C 66 0 75 13 75 30 C 75 46 66 60 45 60 L 15 60 Z"
        />
        <ellipse className="fill-violet-500" cx="79" cy="30" rx="5" ry="5" />
      </>
    ),
  },
  {
    name: "NOT",
    inputs: 1,
    outputs: 1,
    truthTable: {
      "0": "1",
      "1": "0",
    },
    width: 90,
    height: 60,
    icon: (
      <>
        <path
          className="stroke-violet-500 stroke-[5] fill-none"
          d="M 74 30 L 90 30 M 0 30 L 16 30"
        />
        <path className="fill-violet-500" d="M 15 0 L 75 30 L 15 60 Z" />
        <ellipse className="fill-violet-500" cx="77" cy="30" rx="5" ry="5" />
      </>
    ),
  },
  {
    name: "AND",
    inputs: 2,
    outputs: 1,
    truthTable: {
      "00": "0",
      "01": "0",
      "10": "0",
      "11": "1",
    },
    width: 90,
    height: 60,
    icon: (
      <>
        <path
          className="stroke-violet-500 stroke-[5] fill-none"
          d="M 74 30 L 90 30 M 0 15 L 16 15 M 0 45 L 16 45"
        />
        <path
          className="fill-violet-500"
          d="M 15 0 L 45 0 C 66 0 75 13 75 30 C 75 46 66 60 45 60 L 15 60 Z"
        />
      </>
    ),
  },
  {
    name: "OR",
    inputs: 2,
    outputs: 1,
    truthTable: {
      "00": "0",
      "01": "1",
      "10": "1",
      "11": "1",
    },
    width: 90,
    height: 60,
    icon: (
      <>
        <path
          className="stroke-violet-500 stroke-[5] fill-none"
          d="M 74 30 L 90 30 M 0 15 L 22 15 M 0 45 L 22 45"
        />
        <path
          className="fill-violet-500"
          d="M 40 0 C 57.47 0.56 73.06 12.25 80 30 C 73.06 47.75 57.47 59.44 40 60 L 15 60 C 25.72 41.44 25.72 18.56 15 0 Z"
        />
      </>
    ),
  },
  {
    name: "XOR",
    inputs: 2,
    outputs: 1,
    truthTable: {
      "00": "0",
      "01": "1",
      "10": "1",
      "11": "0",
    },
    width: 90,
    height: 60,
    icon: (
      <>
        <path
          className="stroke-violet-500 stroke-[5] fill-none"
          d="M 74 30 L 90 30 M 0 15 L 22 15 M 0 45 L 22 45"
        />
        <path
          className="fill-violet-500"
          d="M 40 0 C 57.47 0.56 73.06 12.25 80 30 C 73.06 47.75 57.47 59.44 40 60 L 15 60 C 25.72 41.44 25.72 18.56 15 0 Z"
        />
        <path
          className="stroke-violet-500 stroke-[5] fill-none"
          d="M 8 0 C 20.72 18.56 20.72 41.44 8 60"
        />
      </>
    ),
  },
  {
    name: "NOR",
    inputs: 2,
    outputs: 1,
    truthTable: {
      "00": "1",
      "01": "0",
      "10": "0",
      "11": "0",
    },
    width: 90,
    height: 60,
    icon: (
      <>
        <path
          className="stroke-violet-500 stroke-[5] fill-none"
          d="M 74 30 L 90 30 M 0 15 L 22 15 M 0 45 L 22 45"
        />
        <path
          className="fill-violet-500"
          d="M 40 0 C 57.47 0.56 73.06 12.25 80 30 C 73.06 47.75 57.47 59.44 40 60 L 15 60 C 25.72 41.44 25.72 18.56 15 0 Z"
        />
        <ellipse className="fill-violet-500" cx="83.75" cy="30" rx="5" ry="5" />
      </>
    ),
  },
  {
    name: "XNOR",
    inputs: 2,
    outputs: 1,
    truthTable: {
      "00": "1",
      "01": "0",
      "10": "0",
      "11": "1",
    },
    width: 90,
    height: 60,
    icon: (
      <>
        <path
          className="stroke-violet-500 stroke-[5] fill-none"
          d="M 74 30 L 90 30 M 0 15 L 22 15 M 0 45 L 22 45"
        />
        <path
          className="fill-violet-500"
          d="M 40 0 C 57.47 0.56 73.06 12.25 80 30 C 73.06 47.75 57.47 59.44 40 60 L 15 60 C 25.72 41.44 25.72 18.56 15 0 Z"
        />
        <path
          className="stroke-violet-500 stroke-[5] fill-none"
          d="M 8 0 C 20.72 18.56 20.72 41.44 8 60"
        />
        <ellipse className="fill-violet-500" cx="83.75" cy="30" rx="5" ry="5" />
      </>
    ),
  },
];
