// types.ts
export type Option<T extends string> = {
  label: T;
  symbol: string;
};

export type E_Currency =
  | "DOLLAR"
  | "VND"
// data.ts

const options: Option<E_Currency>[] = [
  { label: "DOLLAR", symbol: "$" },
  { label: "VND", symbol: "₫" }
];

export const Currency = {
  getAll(): Option<E_Currency>[] {
    return options;
  },

  getLabel(value: E_Currency): E_Currency | undefined {
    return options.find(opt => opt.symbol === value)?.label;
  },

  getSymbol(label: string): string | undefined {
    return options.find(opt => opt.label === label)?.symbol;
  },

  getMap(): Record<E_Currency, string> {
    return Object.fromEntries(options.map(o => [o.symbol, o.label])) as Record<E_Currency, string>;
  }
};
