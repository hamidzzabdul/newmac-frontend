export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "mpesa" | "card" | "cod";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type Order = {
  _id: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;

  subtotal: number;
  shippingFee: number;
  total: number;

  notes?: string;

  customer: {
    firstName: string;
    lastName?: string;
    email: string;
    phone: string;
  };

  items: OrderItem[];

  shippingAddress: {
    street: string;
    city: string;
    postalCode?: string;
    country: string;
    deliveryNotes?: string;
  };

  payment: {
    method: PaymentMethod;
    status: PaymentStatus;

    phone?: string;
    mpesaReceiptNumber?: string;
    transactionDate?: string;
    paidAt?: string;
    failureReason?: string;

    card?: {
      provider?: string;
      last4?: string;
      brand?: string;
    };
  };
};
