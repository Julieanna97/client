export const FREE_SHIPPING_THRESHOLD_SEK = 499;
export const STANDARD_SHIPPING_FEE_SEK = 49;

export const SHIPPING_COUNTRIES = {
  SE: "Sweden",
  DK: "Denmark",
  FI: "Finland",
  NO: "Norway",
  IS: "Iceland",
} as const;

export type ShippingCountryCode = keyof typeof SHIPPING_COUNTRIES;

export const isShippingCountryCode = (
  value: unknown,
): value is ShippingCountryCode =>
  typeof value === "string" &&
  Object.prototype.hasOwnProperty.call(SHIPPING_COUNTRIES, value);

export const getShippingFee = (subtotal: number) =>
  subtotal >= FREE_SHIPPING_THRESHOLD_SEK
    ? 0
    : STANDARD_SHIPPING_FEE_SEK;