export function isValidAlgerianPhone(value: string) {
  const digits = value.replace(/[\s.\-()]/g, "");
  const local = /^0[567]\d{8}$/.test(digits);
  const intl = /^(?:\+213|00213)[567]\d{8}$/.test(digits);
  return local || intl;
}

export function normalizePhone(value: string) {
  let d = value.replace(/[^\d+]/g, "");
  d = d.replace(/^(00213|\+213)/, "0");
  return d;
}

export function isValidNameText(value: string) {
  return /^[\p{L}][\p{L}\s'’.-]{1,59}$/u.test(value.trim());
}

export function isValidStreet(value: string) {
  return /^[\p{L}\d][\p{L}\d\s'’,./-]{2,79}$/u.test(value.trim());
}

export function isValidPostalCode(value: string) {
  return /^\d{5}$/.test(value.trim());
}

export function onlyLetters(value: string) {
  return value.replace(/[^\p{L}\s'’.]/gu, "").slice(0, 60);
}

export function onlyPhoneChars(value: string) {
  return value.replace(/[^\d+\s]/g, "").slice(0, 16);
}

export function onlyDigits(value: string, max = 5) {
  return value.replace(/\D/g, "").slice(0, max);
}

export function isValidWilayaCode(code: string, wilayas: { code: string }[]) {
  return wilayas.some((w) => w.code === code);
}

export function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}
