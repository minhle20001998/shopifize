import en from "~/public/lang/en";
import vi from "~/public/lang/vi";

export type LANGUAGES_TYPE = "en" | "vi";

type LANGUAGES_MAPPING_TYPE = {
  [key in LANGUAGES_TYPE]: unknown;
};

export const LANGUAGES_MAPPING: LANGUAGES_MAPPING_TYPE = {
  en: en,
  vi: vi,
};

export const LANGUAGES_KEYS = Object.keys(LANGUAGES_MAPPING);
