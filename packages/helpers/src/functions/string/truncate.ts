export const truncate = (input: string, length: number) => {
  if (input.length <= length) {
    return input;
  }

  return input.substring(0, length) + '...'; 
}