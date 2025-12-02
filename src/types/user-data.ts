export interface UserData {
  id: number;
  name: string;
  cpf: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  isActive: boolean;
  addresses?: AddressData[];
  orders?: OrderData[];
  passwordResetTokens?: PasswordResetTokenData[];
  paymentMethods?: UserPaymentMethodData[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddressData {
  id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  recipientName: string;
  recipientPhone: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderData {
  id: number;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  trackingNumber?: string;
  shippingCompany?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordResetTokenData {
  id: number;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export interface UserPaymentMethodData {
  id: number;
  paymentMethod: string;
  isDefault: boolean;
  cardLastFour?: string;
  cardBrand?: string;
  cardHolderName?: string;
  cardExpiryMonth?: number;
  cardExpiryYear?: number;
  token: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type Role = 'USER' | 'ADMIN';
