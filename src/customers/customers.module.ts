import { Module } from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from './application/port/customer.repository.port.js';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository.js';

@Module({
  controllers: [],
  providers: [
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
  ],
  exports: [CUSTOMER_REPOSITORY],
})
export class CustomersModule {}
