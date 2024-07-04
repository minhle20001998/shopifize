export class ShopifizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Shopifized Error";
  }
}
