export const hideEmail = (email: string) => {
  let maskedEmail = "";
  let index = email.lastIndexOf("@");
  let prefix = email.substring(0, index);
  let postfix = email.substring(index);

  let mask = prefix
    .split("")
    .map(function (o, i) {
      if (i === 0 || i === 1 || i === index - 1) {
        return o;
      } else {
        return "*";
      }
    })
    .join("");

  maskedEmail = mask + postfix;

  return maskedEmail;
};
