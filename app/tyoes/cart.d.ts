export type CartItem = {
    id: string;
    name: string;
    pricePerKg: number;
    quantityKg: number;   // <-- important for butchery
    image: string;
    category: string;
  };
  