// types.ts
export type Option<T extends string> = {
  label: string;
  value: T;
};

export enum E_SkincareConcern {
  ACNE_BLEMISHES = "ACNE_BLEMISHES",
  ANTI_AGING = "ANTI_AGING",
  BLACKHEADS_PORES = "BLACKHEADS_PORES",
  COMBINATION_SKIN = "COMBINATION_SKIN",
  DAMAGED_SKIN_BARRIER = "DAMAGED_SKIN_BARRIER",
  DARK_CIRCLES = "DARK_CIRCLES",
  DRY_SKIN = "DRY_SKIN",
  DULL_SKIN = "DULL_SKIN",
  OILY_SKIN = "OILY_SKIN",
  PIGMENTATION = "PIGMENTATION",
  REDNESS = "REDNESS",
  SENSITIVE_SKIN = "SENSITIVE_SKIN"
}

// data.ts



const options: Option<E_SkincareConcern>[] = [
  { label: "Acne & Blemishes", value: E_SkincareConcern.ACNE_BLEMISHES },
  { label: "Anti-Aging", value: E_SkincareConcern.ANTI_AGING },
  { label: "Blackheads & Pores", value: E_SkincareConcern.BLACKHEADS_PORES },
  { label: "Combination Skin", value: E_SkincareConcern.COMBINATION_SKIN },
  { label: "Damaged Skin Barrier", value: E_SkincareConcern.DAMAGED_SKIN_BARRIER },
  { label: "Dark Circles", value: E_SkincareConcern.DARK_CIRCLES },
  { label: "Dry Skin", value: E_SkincareConcern.DRY_SKIN },
  { label: "Dull Skin", value: E_SkincareConcern.DULL_SKIN },
  { label: "Oily Skin", value: E_SkincareConcern.OILY_SKIN },
  { label: "Pigmentation", value: E_SkincareConcern.PIGMENTATION },
  { label: "Redness", value: E_SkincareConcern.REDNESS },
  { label: "Sensitive Skin", value: E_SkincareConcern.SENSITIVE_SKIN }
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
