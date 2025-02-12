import { GateTypeEntity } from "../entities/other/GateTypeEntity";

export const basicLogicGates: GateTypeEntity[] = [
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
      </>
    ),
  },
];
