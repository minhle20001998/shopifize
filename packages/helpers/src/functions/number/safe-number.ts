export const safeNumber = (num: unknown, defaultNumber: number) => {
  const parsedNumber = Number(num)
  if(isNaN(parsedNumber)){
    return defaultNumber
  }

  return parsedNumber
}