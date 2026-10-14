import { UniqueId } from '../../../shared/domain/value-objects/unique-id.vo.js';
import { Payment } from '../../domain/entity/payment.entity.js';
import { PaymentId } from '../../domain/value-object/payment-id.vo.js';

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

export interface PaymentRepository {
  save(payment: Payment): Promise<void>;
  findByOrderId(orderId: UniqueId): Promise<Payment | null>;
  findById(id: PaymentId): Promise<Payment | null>;
}
