export const generateOTP = () => {
  return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
}