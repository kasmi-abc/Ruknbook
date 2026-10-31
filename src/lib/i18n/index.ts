import en from "./dictionaries/en";
import ar from "./dictionaries/ar";
import fr from "./dictionaries/fr";

export const dictionaries = { en, ar, fr };

export type Dictionary = typeof en;

export function getDictionary(locale: string): Dictionary {
  return dictionaries[locale as keyof typeof dictionaries] ?? dictionaries.en;
}

export function t(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
}
