import * as countries from "i18n-iso-countries";
import englishLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(englishLocale);

export const FREE_SHIPPING_THRESHOLD_SEK = 499;
export const STANDARD_SHIPPING_FEE_SEK = 49;

export interface ShippingCountry {
  code: string;
  name: string;
}

export type ShippingCountryCode = string;

const countryNames = countries.getNames("en", {
  select: "official",
});

export const SHIPPING_COUNTRIES: ShippingCountry[] = Object.entries(
  countryNames,
)
  .filter(
    ([code, name]) =>
      code.length === 2 &&
      typeof name === "string" &&
      name.trim().length > 0,
  )
  .map(([code, name]) => ({
    code: code.toUpperCase(),
    name,
  }))
  .sort((firstCountry, secondCountry) =>
    firstCountry.name.localeCompare(secondCountry.name, "en"),
  );

export const normalizeShippingCountryCode = (
  value: unknown,
): string => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toUpperCase();
};

export const isShippingCountryCode = (
  value: unknown,
): value is ShippingCountryCode => {
  const code = normalizeShippingCountryCode(value);

  return /^[A-Z]{2}$/.test(code) && countries.isValid(code);
};

export const getShippingFee = (subtotal: number): number => {
  if (!Number.isFinite(subtotal)) {
    return STANDARD_SHIPPING_FEE_SEK;
  }

  return subtotal >= FREE_SHIPPING_THRESHOLD_SEK
    ? 0
    : STANDARD_SHIPPING_FEE_SEK;
};

export const formatSek = (value: number): string => {
  const safeValue = Number.isFinite(value) ? value : 0;

  return `${safeValue.toFixed(2)} SEK`;
};