export function noProviderError() {
  return new Error("Wrap the component with I18nProvider.");
}

export function invalidLanguageIdError(id: string) {
  return new Error(`No language with id ${id} is found.`);
}

export function invalidIdError(id: string) {
  return new Error(`Id ${id} is not valid`);
}
