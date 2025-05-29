// types.ts
export type Option<T extends string> = {
  label: string;
  value: T;
};

export type E_SkincareConcern =
  | "ACNE_BLEMISHES"
  | "ANTI_AGING"
  | "BLACKHEADS_PORES"
  | "COMBINATION_SKIN"
  | "DAMAGED_SKIN_BARRIER"
  | "DARK_CIRCLES"
  | "DRY_SKIN"
  | "DULL_SKIN"
  | "OILY_SKIN"
  | "PIGMENTATION"
  | "REDNESS"
  | "SENSITIVE_SKIN";

// data.ts



const options: Option<E_SkincareConcern>[] = [
  { label: "Acne & Blemishes", value: "ACNE_BLEMISHES" },
  { label: "Anti-Ageing", value: "ANTI_AGING" },
  { label: "Blackheads & Pores", value: "BLACKHEADS_PORES" },
  { label: "Combination Skin", value: "COMBINATION_SKIN" },
  { label: "Damaged Skin Barrier", value: "DAMAGED_SKIN_BARRIER" },
  { label: "Dark Circles", value: "DARK_CIRCLES" },
  { label: "Dry Skin", value: "DRY_SKIN" },
  { label: "Dull Skin", value: "DULL_SKIN" },
  { label: "Oily Skin", value: "OILY_SKIN" },
  { label: "Pigmentation", value: "PIGMENTATION" },
  { label: "Redness", value: "REDNESS" },
  { label: "Sensitive Skin", value: "SENSITIVE_SKIN" }
];

export const SkincareConcern = {
  getAll(): Option<E_SkincareConcern>[] {
    return options;
  },

  getLabel(value: E_SkincareConcern): string | undefined {
    return options.find(opt => opt.value === value)?.label;
  },

  getValue(label: string): E_SkincareConcern | undefined {
    return options.find(opt => opt.label === label)?.value;
  },

  getMap(): Record<E_SkincareConcern, string> {
    return Object.fromEntries(options.map(o => [o.value, o.label])) as Record<E_SkincareConcern, string>;
  }
};
