export const removeEmptyValues = (obj: Record<string, unknown>) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    }
  }
  return obj;
}