import { GateTypeEntity } from "../entities/other/GateTypeEntity";

export const basicLogicGates: GateTypeEntity[] = [
  {
    name: "NOT",
    nameOffset: { x: -8, y: 0 },
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
          className="stroke-dark-light dark:stroke-light-dark stroke-[5] fill-none"
          d="M 74 30 L 90 30 M 0 30 L 16 30"
        />
        <path className="fill-violet-500" d="M 15 0 L 75 30 L 15 60 Z" />
        <ellipse className="fill-violet-500" cx="77" cy="30" rx="5" ry="5" />
      </>
    ),
  },
  {
    name: "AND",
    nameOffset: { x: 0, y: 0 },
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
          className="stroke-dark-light dark:stroke-light-dark stroke-[5] fill-none"
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
    name: "NAND",
    nameOffset: { x: 0, y: 0 },
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
          className="stroke-dark-light dark:stroke-light-dark stroke-[5] fill-none"
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
    name: "OR",
    nameOffset: { x: -2, y: 0 },
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
          className="stroke-dark-light dark:stroke-light-dark stroke-[5] fill-none"
          d="M 74 30 L 90 30 M 0 15 L 22 15 M 0 45 L 22 45"
        />
        <path
          className="fill-violet-500"
          d="M 36 0 C 53.47 0.56 69.06 12.25 76 30 C 69.06 47.75 53.47 59.44 36 60 L 11 60 C 21.72 41.44 21.72 18.56 10 0 Z"
        />
      </>
    ),
  },
  {
    name: "NOR",
    nameOffset: { x: 0, y: 0 },
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
          className="stroke-dark-light dark:stroke-light-dark stroke-[5] fill-none"
          d="M 74 30 L 90 30 M 0 15 L 22 15 M 0 45 L 22 45"
        />
        <path
          className="fill-violet-500"
          d="M 36 0 C 53.47 0.56 69.06 12.25 76 30 C 69.06 47.75 53.47 59.44 36 60 L 11 60 C 21.72 41.44 21.72 18.56 10 0 Z"
        />
        <ellipse className="fill-violet-500" cx="79" cy="30" rx="5" ry="5" />
      </>
    ),
  },
  {
    name: "XOR",
    nameOffset: { x: -2, y: 0 },
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
          className="stroke-dark-light dark:stroke-light-dark stroke-[5] fill-none"
          d="M 74 30 L 90 30 M 0 15 L 22 15 M 0 45 L 22 45"
        />
        <path
          className="fill-violet-500"
          d="M 36 0 C 53.47 0.56 69.06 12.25 76 30 C 69.06 47.75 53.47 59.44 36 60 L 11 60 C 21.72 41.44 21.72 18.56 10 0 Z"
        />
        <path
          className="stroke-violet-500 stroke-[5] fill-none"
          d="M 4 0 C 16.72 18.56 16.72 41.44 4 60"
        />
      </>
    ),
  },
  {
    name: "XNOR",
    nameOffset: { x: 0, y: 0 },
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
          className="stroke-dark-light dark:stroke-light-dark stroke-[5] fill-none"
          d="M 74 30 L 90 30 M 0 15 L 22 15 M 0 45 L 22 45"
        />
        <path
          className="fill-violet-500"
          d="M 36 0 C 53.47 0.56 69.06 12.25 76 30 C 69.06 47.75 53.47 59.44 36 60 L 11 60 C 21.72 41.44 21.72 18.56 10 0 Z"
        />
        <path
          className="stroke-violet-500 stroke-[5] fill-none"
          d="M 4 0 C 16.72 18.56 16.72 41.44 4 60"
        />
        <ellipse className="fill-violet-500" cx="79" cy="30" rx="5" ry="5" />
      </>
    ),
  },
];
