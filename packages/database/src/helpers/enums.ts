export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  SELLER = "seller",
}

export enum GENDER {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum PAYMENT_STATUS {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled',
  REFUNDED = 'Refund',
}

export enum PAYMENT_METHOD {
  CREDIT_CARD = 'Credit Card',
  DEBIT_CARD = 'Debit Card',
  BANK = 'Bank',
  COD = 'Cash on Delivery'
}

export enum ORDER_STATUS {
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
