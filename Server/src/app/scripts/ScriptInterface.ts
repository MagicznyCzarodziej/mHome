export interface Script {
  name: string;
  register: (onFired: (firedAt: Date) => void) => void;
  execute: () => void;
}
