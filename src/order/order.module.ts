import { Module } from '@nestjs/common';
import { ORDER_REPOSITORY } from './application/port/order.repository.port.js';
import { DrizzleOrderRepository } from './infrastructure/adapters/drizzle-order.repository.js';

@Module({
  imports: [],
  providers: [
    {
      provide: ORDER_REPOSITORY,
      useClass: DrizzleOrderRepository,
    },
  ],
})
export class OrderModule {}
