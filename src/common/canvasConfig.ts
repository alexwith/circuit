import { Flow, Pos } from "./types";

// Pin
export const PIN_SIZE = 20; // diameter px

// Terminal
export const TERMINAL_PIN_OFFSET = (flow: Flow): Pos => ({ x: flow === Flow.In ? 56 : 0, y: 5.5 });
