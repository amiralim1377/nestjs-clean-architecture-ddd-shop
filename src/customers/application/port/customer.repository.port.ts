import { Customer } from '../../domain/entities/customer.entity.js';
import { CustomerId } from '../../domain/value-object/customer-id.vo.js';
import { Email } from '../../domain/value-object/email.vo.js';

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');

export interface CustomerRepositoryPort {
  save(customer: Customer): Promise<void>;
  findById(id: CustomerId): Promise<Customer | null>;
  findByEmail(email: Email): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  delete(id: CustomerId): Promise<void>;
}
