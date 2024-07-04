export function removeQueryParamsFromUrl(path: string) {
  const queryStart = path.indexOf('?'); // Find the index of the first question mark (?)

  if (queryStart !== -1) {
    // If query parameters are found, remove them by taking the substring before the first question mark
    return path.substring(0, queryStart);
  }

  // If there are no query parameters, return the original path as is
  return path;
}