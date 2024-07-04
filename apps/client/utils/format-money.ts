export const formatCurrency = (money: number, currency?: string) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency ?? "VND",
  }).format(money);
};
