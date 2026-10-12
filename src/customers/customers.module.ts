import { Module } from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from './application/port/customer.repository.port.js';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository.js';
import { CustomerController } from './customers.controller.js';
import { CommandHandlers } from './application/use-case/index.js';
import { QueryHandlers } from './application/queries/handlers/index.js';
import { NOTIFICATION_SERVICE } from './application/port/notification.port.js';
import { ConsoleNotificationAdapter } from './infrastructure/adapters/console-notification.adapter.js';

@Module({
  controllers: [CustomerController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
    {
      provide: NOTIFICATION_SERVICE,
      useClass: ConsoleNotificationAdapter,
    },
  ],
  exports: [CUSTOMER_REPOSITORY],
})
export class CustomersModule {}
