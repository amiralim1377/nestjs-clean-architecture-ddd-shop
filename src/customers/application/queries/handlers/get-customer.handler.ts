import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerQuery } from '../get-customer.query.js';
import { Customer } from '../../../domain/entities/customer.entity.js';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '../../port/customer.repository.port.js';
import { Inject } from '@nestjs/common';
import { CustomerId } from '../../../domain/value-object/customer-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<
  GetCustomerQuery,
  Customer
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const customer = await this.customerRepository.findById(
      new CustomerId(query.customerId),
    );

    if (!customer) {
      throw new ApplicationException(
        `Customer with id ${query.customerId} not found.`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return customer;
  }
}
