export const removeItemByIndex = <T>(arr: T[], index: number) => {
  // Ensure the index is within the bounds of the array
  if (index < 0 || index >= arr.length) {
    return arr;
  }

  // Create a new array without the item at the specified index
  const newArray = [...arr.slice(0, index), ...arr.slice(index + 1)];
  return newArray;
}