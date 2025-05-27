export enum E_PaymentMethod {
  COD = 'COD',
  VNPAY = 'VNPAY',
}

export const PaymentMethodDescriptions: Record<E_PaymentMethod, string> = {
  [E_PaymentMethod.COD]: 'Pay on Delivery (COD)',
  [E_PaymentMethod.VNPAY]: 'Pay with VNPAY',
};