import { Inject, Injectable } from '@nestjs/common';
import { CustomerPort } from '../../application/port/customer.port.js';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '../../../customers/application/port/customer.repository.port.js';
import { CustomerId } from '../../../customers/domain/value-object/customer-id.vo.js';

@Injectable()
export class CustomerAdapter implements CustomerPort {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async exists(customerId: string): Promise<boolean> {
    const customer = await this.customerRepository.findById(
      new CustomerId(customerId),
    );
    return customer !== null;
  }
}
