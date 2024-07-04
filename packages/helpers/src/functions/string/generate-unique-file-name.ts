export function createUniqueSuffix() {
  return Date.now() + '-' + Math.round(Math.random() * 1e9);
}

export function generateUniqueFileName(fileName: string) {
  return createUniqueSuffix() + '-' + fileName;
}