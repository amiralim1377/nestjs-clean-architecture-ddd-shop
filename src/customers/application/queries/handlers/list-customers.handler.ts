import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCustomersQuery } from '../list-customers.query.js';
import { Customer } from '../../../domain/entities/customer.entity.js';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '../../port/customer.repository.port.js';

@QueryHandler(ListCustomersQuery)
export class ListCustomersHandler implements IQueryHandler<
  ListCustomersQuery,
  Customer[]
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(query: ListCustomersQuery): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }
}
