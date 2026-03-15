import { calculateTotalAmount, calculateTotalAmountTendered, calculateTotalBalance } from './functions';
import type { LineItem, Payment } from '../types';

const createLineItem = (overrides: Partial<LineItem> = {}): LineItem => ({
  uuid: 'line-item-uuid',
  item: 'Service Item',
  billableService: 'Billable Service',
  paymentStatus: 'PENDING',
  quantity: 1,
  price: 100,
  priceName: 'Standard',
  priceUuid: 'price-uuid',
  lineItemOrder: 1,
  resourceVersion: '1.0',
  display: 'Line Item Display',
  voided: false,
  voidReason: null,
  ...overrides,
});

const createPayment = (overrides: Partial<Payment> = {}): Payment => ({
  uuid: 'payment-uuid',
  instanceType: {
    uuid: 'instance-uuid',
    name: 'Payment',
    description: 'Payment instance',
    retired: false,
  },
  attributes: [],
  amount: 250,
  amountTendered: 250,
  dateCreated: Date.now(),
  voided: false,
  resourceVersion: '1.0',
  ...overrides,
});

describe('calculateTotalAmount', () => {
  it('returns the sum of price × quantity for all non-voided line items', () => {
    const lineItems = [createLineItem({ price: 100, quantity: 2 }), createLineItem({ price: 50, quantity: 3 })];
    expect(calculateTotalAmount(lineItems)).toBe(350);
  });

  it('excludes voided line items', () => {
    const lineItems = [
      createLineItem({ price: 100, quantity: 1 }),
      createLineItem({ price: 50, quantity: 1, voided: true }),
    ];
    expect(calculateTotalAmount(lineItems)).toBe(100);
  });

  it('returns 0 for an empty array', () => {
    expect(calculateTotalAmount([])).toBe(0);
  });

  it('returns 0 for a non-array input', () => {
    expect(calculateTotalAmount(null as unknown as Array<LineItem>)).toBe(0);
  });
});

describe('calculateTotalAmountTendered', () => {
  it('returns the sum of amount for all non-voided payments', () => {
    const payments = [createPayment({ amount: 100 }), createPayment({ amount: 150 })];
    expect(calculateTotalAmountTendered(payments)).toBe(250);
  });

  it('excludes voided payments', () => {
    const payments = [createPayment({ amount: 100 }), createPayment({ amount: 50, voided: true })];
    expect(calculateTotalAmountTendered(payments)).toBe(100);
  });

  it('returns 0 for an empty array', () => {
    expect(calculateTotalAmountTendered([])).toBe(0);
  });

  it('returns 0 for a non-array input', () => {
    expect(calculateTotalAmountTendered(null as unknown as Array<Payment>)).toBe(0);
  });
});

describe('calculateTotalBalance', () => {
  it('returns the difference between total bill amount and amount tendered', () => {
    const lineItems = [createLineItem({ price: 500, quantity: 1 })];
    const payments = [createPayment({ amount: 200 })];
    expect(calculateTotalBalance(lineItems, payments)).toBe(300);
  });

  it('returns 0 when bill is fully paid', () => {
    const lineItems = [createLineItem({ price: 250, quantity: 1 })];
    const payments = [createPayment({ amount: 250 })];
    expect(calculateTotalBalance(lineItems, payments)).toBe(0);
  });

  it('returns a negative value when overpaid', () => {
    const lineItems = [createLineItem({ price: 100, quantity: 1 })];
    const payments = [createPayment({ amount: 150 })];
    expect(calculateTotalBalance(lineItems, payments)).toBe(-50);
  });

  it('returns 0 when there are no line items and no payments', () => {
    expect(calculateTotalBalance([], [])).toBe(0);
  });
});
