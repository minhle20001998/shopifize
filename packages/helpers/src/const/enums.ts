export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}
export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  SELLER = "seller",
}

export enum PaymentStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled',
  REFUNDED = 'Refund',
}

export enum PaymentMethod {
  CREDIT_CARD = 'Credit Card',
  DEBIT_CARD = 'Debit Card',
  BANK = 'Bank',
  COD = 'Cash on Delivery'
}

export enum OrderStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  REFUNDED = 'Refunded',
  FAILED = 'Failed',
  COMPLETED = 'Completed',
}