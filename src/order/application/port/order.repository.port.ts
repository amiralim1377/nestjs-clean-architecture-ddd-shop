import { Order } from '../../domain/entity/order.entity.js';
import { OrderId } from '../../domain/value-object/order-id.vo.js';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderRepositoryPort {
  save(order: Order): Promise<void>;
  findById(id: OrderId): Promise<Order | null>;
  findByCustomerId(customerId: string): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  delete(id: OrderId): Promise<void>;
}
